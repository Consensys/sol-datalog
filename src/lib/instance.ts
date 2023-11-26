import { spawnSync } from "child_process";
import fse from "fs-extra";
import os from "os";
import { basename, join } from "path";
import { OutputRelations } from "./souffle";
import * as sol from "solc-typed-ast";
import { searchRecursive } from "./utils";
import { parse } from "csv-parse/sync";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export type SouffleOutputType = "csv" | "sqlite";

export abstract class SouffleInstance {
    protected tmpDir!: string;
    protected inputFile!: string;
    protected outputFiles!: string[];
    protected success: boolean;

    constructor(
        private readonly datalog: string,
        private readonly outputRelations: string[],
        private readonly outputRelationsMode: SouffleOutputType
    ) {
        this.success = false;
    }

    async run(): Promise<void> {
        const sysTmpDir = os.tmpdir();
        this.tmpDir = await fse.mkdtempSync(join(sysTmpDir, "sol-datalog-"));

        this.inputFile = join(this.tmpDir, "input.dl");

        const outputDirectives = this.outputRelations.map((reln) =>
            this.outputRelationsMode === "csv"
                ? `.output ${reln}`
                : `.output ${reln}(IO=sqlite, dbname="output.sqlite")`
        );

        this.outputFiles =
            this.outputRelationsMode === "csv"
                ? this.outputRelations.map((reln) => join(this.tmpDir, `${reln}.csv`))
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
}

export class SouffleCSVInstance extends SouffleInstance {
    constructor(datalog: string, outputRelations: string[]) {
        super(datalog, outputRelations, "csv");
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
    constructor(datalog: string, outputRelations: string[]) {
        super(datalog, outputRelations, "sqlite");
    }

    async result(): Promise<Database> {
        sol.assert(this.success, ``);
        const db = await open({
            filename: "/tmp/database.db",
            driver: sqlite3.cached.Database
        });

        return db;
    }
}
