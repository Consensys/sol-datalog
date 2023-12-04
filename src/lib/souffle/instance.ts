import { spawnSync } from "child_process";
import fse from "fs-extra";
import os from "os";
import { basename, join } from "path";
import { OutputRelations } from "../souffle";
import * as sol from "solc-typed-ast";
import { searchRecursive } from "../utils";
import { parse } from "csv-parse/sync";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { TypeEnv, buildTypeEnv } from "./types";
import { Relation, getRelations } from "./relation";
import { Fact } from "./fact";

export type SouffleOutputType = "csv" | "sqlite";

export abstract class SouffleInstance {
    protected tmpDir!: string;
    protected inputFile!: string;
    protected outputFiles!: string[];
    protected success: boolean;

    protected env: TypeEnv;
    protected _relations: Map<string, Relation>;

    constructor(
        private readonly datalog: string,
        private readonly outputRelationsMode: SouffleOutputType
    ) {
        this.success = false;

        this.env = buildTypeEnv(this.datalog);
        this._relations = new Map(getRelations(this.datalog, this.env).map((r) => [r.name, r]));
    }

    async run(outputRelations: string[]): Promise<void> {
        const sysTmpDir = os.tmpdir();
        this.tmpDir = await fse.mkdtempSync(join(sysTmpDir, "sol-datalog-"));

        this.inputFile = join(this.tmpDir, "input.dl");

        const outputDirectives = outputRelations.map((reln) =>
            this.outputRelationsMode === "csv"
                ? `.output ${reln}`
                : `.output ${reln}(IO=sqlite, dbname="output.sqlite")`
        );

        this.outputFiles =
            this.outputRelationsMode === "csv"
                ? outputRelations.map((reln) => join(this.tmpDir, `${reln}.csv`))
                : [join(this.tmpDir, "output.sqlite")];

        const finalDL = this.datalog + "\n" + outputDirectives.join("\n");

        fse.writeFileSync(this.inputFile, finalDL, {
            encoding: "utf-8"
        });

        const result = spawnSync("souffle", ["--wno", "all", "-D", this.tmpDir, this.inputFile], {
            encoding: "utf-8"
        });

        if (result.status !== 0) {
            throw new Error(
                `Souffle terminated with non-zero exit code (${result.status}): ${result.stderr}`
            );
        }

        this.success = true;
    }

    release(): void {
        fse.removeSync(this.inputFile);
        for (const f of this.outputFiles) {
            fse.removeSync(f);
        }

        fse.rmdirSync(this.tmpDir);
    }

    relations(): Iterable<Relation> {
        return this._relations.values();
    }

    relation(name: string): Relation | undefined {
        return this._relations.get(name);
    }
}

export class SouffleCSVInstance extends SouffleInstance {
    constructor(datalog: string) {
        super(datalog, "csv");
    }

    results(): OutputRelations {
        sol.assert(this.success, ``);
        return this.readProducedCsvFiles();
    }

    private parseCsv(content: string, delimiter = "\t"): string[][] {
        const config = {
            skipEmptyLines: true,
            cast: true,
            delimiter
        };

        return parse(content, config);
    }

    private readProducedCsvFiles(): OutputRelations {
        const relMap: OutputRelations = new Map();
        const outputFiles = searchRecursive(this.tmpDir, (x) => x.endsWith(".csv"));

        for (const fileName of outputFiles) {
            const rel = basename(fileName, ".csv");

            const content = fse.readFileSync(fileName, { encoding: "utf-8" });
            const entries = this.parseCsv(content);

            relMap.set(rel, entries);
        }

        return relMap;
    }
}

export class SouffleSQLiteInstance extends SouffleInstance {
    private db!: Database;

    constructor(datalog: string) {
        super(datalog, "sqlite");
    }

    async run(outputRelations: string[]): Promise<void> {
        await super.run(outputRelations);

        this.db = await open({
            filename: this.outputFiles[0],
            driver: sqlite3.Database
        });
    }

    /// @todo rename to something more descriptive
    async getRelation(name: string): Promise<Fact[]> {
        const r = this._relations.get(name);
        sol.assert(r !== undefined, `Uknown relation ${name}`);

        const rawRes = await this.db.all(`SELECT * from ${name}`);

        return Fact.fromSQLRows(r, rawRes);
    }

    async getSQL(sql: string): Promise<any[]> {
        return await this.db.all(sql);
    }
}
