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
import {
    DatalogNumber,
    DatalogRecordType,
    DatalogSubtype,
    DatalogSymbol,
    DatalogType,
    TypeEnv,
    buildTypeEnv
} from "./types";
import { Relation, getRelations } from "./relation";
import { Fact, FieldVal, ppFieldVal } from "./fact";

export type SouffleOutputType = "csv" | "sqlite";

const MY_DIR = __dirname;
const DEFAULT_SO_DIR = join(MY_DIR, "../../functors");

export interface SouffleInstanceI {
    run(outputRelations: string[]): Promise<void>;
    release(): void;
    relation(name: string): Relation;
    relations(): Iterable<Relation>;
    relationFacts(name: string): Promise<Fact[]>;
}

export interface SouffleSQLInstanceI extends SouffleInstanceI {
    getSQL(sql: string): Promise<any[]>;
    dbName(): string;
}

export abstract class SouffleInstance {
    protected tmpDir!: string;
    protected inputFile!: string;
    protected outputFiles!: string[];
    protected success: boolean;

    protected env: TypeEnv;
    protected _relations: Map<string, Relation>;
    protected soDir: string;

    constructor(
        private readonly datalog: string,
        private readonly outputRelationsMode: SouffleOutputType,
        soDir?: string
    ) {
        this.success = false;

        this.env = buildTypeEnv(this.datalog);
        this._relations = new Map(getRelations(this.datalog, this.env).map((r) => [r.name, r]));

        this.soDir = soDir ? soDir : DEFAULT_SO_DIR;
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

        const result = spawnSync(
            "souffle",
            ["--wno", "all", `-L${this.soDir}`, "-D", this.tmpDir, this.inputFile],
            {
                encoding: "utf-8"
            }
        );

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

    relation(name: string): Relation {
        const res = this._relations.get(name);
        sol.assert(res !== undefined, `Unknown relation ${name}`);
        return res;
    }
}

export class BaseSouffleCSVInstance extends SouffleInstance {
    private _results: OutputRelations | undefined;

    constructor(datalog: string, soDir?: string) {
        super(datalog, "csv", soDir);
    }

    results(): OutputRelations {
        sol.assert(this.success, `Instance not run yet`);
        if (!this._results) {
            this._results = this.readProducedCsvFiles();
        }

        return this._results;
    }

    private parseCsv(content: string, delimiter = "\t"): string[][] {
        const config = {
            skipEmptyLines: true,
            cast: true,
            delimiter
        };

        return parse(content, config);
    }

    protected readProducedCsvFiles(): OutputRelations {
        const relMap: OutputRelations = new Map();
        const outputFiles = searchRecursive(this.tmpDir, (x) => x.endsWith(".csv"));

        for (const fileName of outputFiles) {
            const relName = basename(fileName, ".csv");
            const relation = this.relation(relName);

            const content = fse.readFileSync(fileName, { encoding: "utf-8" });
            const entries = this.parseCsv(content);

            relMap.set(relName, Fact.fromCSVRows(relation, entries));
        }

        return relMap;
    }
}

export class SouffleCSVInstance extends BaseSouffleCSVInstance implements SouffleInstanceI {
    async relationFacts(name: string): Promise<Fact[]> {
        const res = this.results();
        const facts = res.get(name);

        sol.assert(facts !== undefined, `Unknown relation ${name}`);
        return facts;
    }
}

function datalogToSQLType(typ: DatalogType): string {
    if (typ === DatalogNumber) {
        return "INTEGER";
    }

    if (typ === DatalogSymbol) {
        return "TEXT";
    }

    if (typ instanceof DatalogSubtype) {
        return datalogToSQLType(typ.baseType());
    }

    if (typ instanceof DatalogRecordType) {
        return "TEXT";
    }

    throw new Error(`NYI datalogToSQLType(${typ})`);
}

function fieldValToSQLVal(val: FieldVal, typ: DatalogType): string {
    if (typ === DatalogNumber) {
        return ppFieldVal(val, typ);
    }

    if (typ instanceof DatalogSubtype) {
        return fieldValToSQLVal(val, typ.baseType());
    }

    if (typ === DatalogSymbol || typ instanceof DatalogRecordType) {
        return `"${ppFieldVal(val, typ)}"`;
    }

    throw new Error(`NYI datalogToSQLType(${typ})`);
}

export class SouffleCSVToSQLInstance extends BaseSouffleCSVInstance implements SouffleInstanceI {
    private _db: Database<sqlite3.Database, sqlite3.Statement> | undefined;
    private _dbName: string | undefined;

    protected async getDB(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
        if (this._db !== undefined) {
            return this._db;
        }

        this._dbName = join(this.tmpDir, "output.sqlite");
        this.outputFiles.push(this._dbName);

        this._db = await open({
            filename: this._dbName,
            driver: sqlite3.Database
        });

        this.populateDatabase(this._db);

        return this._db;
    }

    private populateDatabase(db: Database<sqlite3.Database, sqlite3.Statement>) {
        sol.assert(this.success, `Analysis is not finished`);
        const output = this.readProducedCsvFiles();

        for (const [relnName, rows] of output) {
            const relation = this.relation(relnName);

            // First create the table
            const columns: string[] = relation.fields.map(
                ([name, typ]) => `${name} ${datalogToSQLType(typ)}`
            );

            db.exec(`CREATE TABLE ${relnName} (${columns.join(", ")})`);

            // Next populate it with data
            for (const row of rows) {
                const values: string[] = row.fields.map((v, i) =>
                    fieldValToSQLVal(v, relation.fields[i][1])
                );

                db.exec(`INSERT INTO ${relnName} VALUES (${values.join(", ")})`);
            }
        }
    }

    async relationFacts(name: string): Promise<Fact[]> {
        const r = this._relations.get(name);
        sol.assert(r !== undefined, `Uknown relation ${name}`);

        const db = await this.getDB();
        const rawRes = await db.all(`SELECT * from ${name}`);

        return Fact.fromSQLRows(r, rawRes);
    }

    async getSQL(sql: string): Promise<any[]> {
        const db = await this.getDB();
        return await db.all(sql);
    }
}

/**
 * For now this instance is not to be used due to https://github.com/souffle-lang/souffle/issues/2457
 */
export class SouffleSQLiteInstance extends SouffleInstance implements SouffleSQLInstanceI {
    private db!: Database;

    constructor(datalog: string, soDir?: string) {
        super(datalog, "sqlite", soDir);
    }

    async run(outputRelations: string[]): Promise<void> {
        await super.run(outputRelations);

        this.db = await open({
            filename: this.outputFiles[0],
            driver: sqlite3.Database
        });
    }

    dbName(): string {
        return this.outputFiles[0];
    }

    async relationFacts(name: string): Promise<Fact[]> {
        const r = this._relations.get(name);
        sol.assert(r !== undefined, `Uknown relation ${name}`);

        const rawRes = await this.db.all(`SELECT * from ${name}`);

        return Fact.fromSQLRows(r, rawRes);
    }

    async getSQL(sql: string): Promise<any[]> {
        return await this.db.all(sql);
    }
}
