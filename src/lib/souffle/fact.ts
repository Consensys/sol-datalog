import * as sol from "solc-typed-ast";
import { Relation } from "./relation";
import {
    DatalogRecordType,
    DatalogSubtype,
    DatalogType,
    DatalogNumber,
    DatalogSymbol
} from "./types";
import { ParsedFieldVal, parseValue } from "./value_parser";
import { zip } from "../utils";

export type FieldVal = string | number | bigint | { [field: string]: FieldVal } | null;

function fieldValToJSON(val: FieldVal, typ: DatalogType): any {
    if (typ === DatalogSymbol || typ == DatalogNumber) {
        return val;
    }

    if (typ instanceof DatalogSubtype) {
        return fieldValToJSON(val, typ.baseType());
    }

    if (typ instanceof DatalogRecordType) {
        if (val === null) {
            return null;
        }

        sol.assert(val instanceof Object, `Expected an object in fieldValToJSON, not ${val}`);
        return typ.fields.map(([name, fieldT]) => fieldValToJSON(val[name], fieldT));
    }

    throw new Error(`NYI type ${typ.name}`);
}

export function ppFieldVal(val: FieldVal, typ: DatalogType): string {
    if (typ === DatalogSymbol) {
        return val as string;
    }

    if (typ === DatalogNumber) {
        return `${val as number | bigint}`;
    }

    if (typ instanceof DatalogSubtype) {
        return ppFieldVal(val, typ.baseType());
    }

    if (typ instanceof DatalogRecordType) {
        if (val === null) {
            return `nil`;
        }

        sol.assert(val instanceof Object, `Expected an object in ppFieldVal`);
        return `[${typ.fields.map(([name, fieldT]) => ppFieldVal(val[name], fieldT)).join(", ")}]`;
    }

    throw new Error(`NYI type ${typ.name}`);
}

function translateVal(raw: ParsedFieldVal, typ: DatalogType): FieldVal {
    if (typ === DatalogNumber) {
        sol.assert(
            typeof raw === "number",
            `Expected a number when translating a number, not {0}`,
            typeof raw
        );
        return raw;
    }

    if (typ === DatalogSymbol) {
        sol.assert(typeof raw === "string", `Expected a string when translating a symbol`);
        return raw;
    }

    if (typ instanceof DatalogSubtype) {
        return translateVal(raw, typ.baseType());
    }

    if (typ instanceof DatalogRecordType) {
        if (raw === null) {
            return null;
        }

        sol.assert(raw instanceof Array && raw.length === typ.fields.length, ``);

        return Object.fromEntries(
            zip(
                typ.fields.map((x) => x[0]),
                raw.map((x, i) => translateVal(x, typ.fields[i][1]))
            )
        );
    }

    throw new Error(`NYI type ${typ.name}`);
}

function parseFieldValFromCsv(val: any, typ: DatalogType): FieldVal {
    if (typ === DatalogNumber) {
        sol.assert(typeof val === "number", `Expected a number`);
        return val;
    }

    if (typ === DatalogSymbol) {
        sol.assert(typeof val === "string", `Expected a string`);
        return val;
    }

    if (typ instanceof DatalogSubtype) {
        return parseFieldValFromCsv(val, typ.baseType());
    }

    if (typ instanceof DatalogRecordType) {
        sol.assert(typeof val === "string", `Expected a string`);
        return translateVal(parseValue(val), typ);
    }

    throw new Error(`NYI datalog type ${typ}`);
}

function parseFieldValFromSQL(val: any, typ: DatalogType): FieldVal {
    if (typ === DatalogNumber) {
        sol.assert(typeof val === "number", `Expected a number`);
        return val;
    }

    if (typ === DatalogSymbol) {
        sol.assert(typeof val === "string", `Expected a string`);
        return val;
    }

    if (typ instanceof DatalogSubtype) {
        return parseFieldValFromCsv(val, typ.baseType());
    }

    if (typ instanceof DatalogRecordType) {
        if (typeof val === "string") {
            return translateVal(parseValue(val), typ);
        }

        throw new Error(`NYI parsing record types from ${val}`);
    }

    throw new Error(`NYI datalog type ${typ}`);
}

export class Fact {
    private constructor(
        public readonly relation: Relation,
        public readonly fields: FieldVal[]
    ) {}

    toCSVRow(): string[] {
        return this.fields.map((x, i) => ppFieldVal(x, this.relation.fields[i][1]));
    }

    toJSON(): any {
        return this.fields.map((x, i) => fieldValToJSON(x, this.relation.fields[i][1]));
    }

    static fromCSVRow(rel: Relation, cols: string[]): Fact {
        const primitiveTypes = rel.fields.map(([, typ]) =>
            typ instanceof DatalogSubtype ? typ.baseType() : typ
        );

        sol.assert(cols.length === primitiveTypes.length, ``);

        return new Fact(
            rel,
            cols.map((val, idx) => parseFieldValFromCsv(val, primitiveTypes[idx]))
        );
    }

    static fromCSVRows(rel: Relation, rows: string[][]): Fact[] {
        const fieldTypes = rel.fields.map(([, typ]) => typ);
        sol.assert(rows[0].length === fieldTypes.length, ``);

        return rows.map(
            (cols) =>
                new Fact(
                    rel,
                    cols.map((val, idx) => parseFieldValFromCsv(val, fieldTypes[idx]))
                )
        );
    }

    static fromSQLRow(rel: Relation, obj: any): Fact {
        return new Fact(
            rel,
            rel.fields.map(([name, typ]) => parseFieldValFromSQL(obj[name], typ))
        );
    }

    static fromSQLRows(rel: Relation, objs: any[]): Fact[] {
        return objs.map(
            (obj) =>
                new Fact(
                    rel,
                    rel.fields.map(([name, typ]) => parseFieldValFromSQL(obj[name], typ))
                )
        );
    }
}
