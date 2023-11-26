import * as sol from "solc-typed-ast";
import { Relation } from "./relation";
import { DatalogSubtype, DatalogType, number, symbol } from "./types";

type FieldVal = string | number | bigint;

function parseFieldValFromCsv(val: string, typ: DatalogType): FieldVal {
    if (typ === number) {
        return Number(val);
    }

    if (typ === symbol) {
        return val;
    }

    throw new Error(`NYI primitive type ${typ.name}`);
}

export class Fact {
    private constructor(
        public readonly relation: Relation,
        public readonly fields: FieldVal[]
    ) {}

    static fromCSVRow(rel: Relation, cols: string[]): Fact {
        const primitiveTypes = rel.fields.map(([, typ]) =>
            typ instanceof DatalogSubtype ? typ.baseType : typ
        );

        sol.assert(cols.length === primitiveTypes.length, ``);

        return new Fact(
            rel,
            cols.map((val, idx) => parseFieldValFromCsv(val, primitiveTypes[idx]))
        );
    }

    static fromCSVRows(rel: Relation, rows: string[][]): Fact[] {
        const primitiveTypes = rel.fields.map(([, typ]) =>
            typ instanceof DatalogSubtype ? typ.baseType : typ
        );

        sol.assert(rows[0].length === primitiveTypes.length, ``);

        return rows.map(
            (cols) =>
                new Fact(
                    rel,
                    cols.map((val, idx) => parseFieldValFromCsv(val, primitiveTypes[idx]))
                )
        );
    }

    static fromSQLRow(rel: Relation, obj: any): Fact {
        const primitiveFields = rel.fields.map(([name, typ]) => [
            name,
            typ instanceof DatalogSubtype ? typ.baseType : typ
        ]) as Array<[string, DatalogType]>;

        return new Fact(
            rel,
            primitiveFields.map(([name]) => obj[name])
        );
    }

    static fromSQLRows(rel: Relation, objs: any[]): Fact[] {
        const primitiveFields = rel.fields.map(([name, typ]) => [
            name,
            typ instanceof DatalogSubtype ? typ.baseType : typ
        ]) as Array<[string, DatalogType]>;

        return objs.map(
            (obj) =>
                new Fact(
                    rel,
                    primitiveFields.map(([name]) => obj[name])
                )
        );
    }
}
