import * as sol from "solc-typed-ast";

export type TypeEnv = Map<string, DatalogType>;
export abstract class DatalogType {
    constructor(public readonly name: string) {}
}
class DatalogPrimitiveType extends DatalogType {}

export const number = new DatalogPrimitiveType("number");
export const symbol = new DatalogPrimitiveType("symbol");

const subtypeDeclRx = /.type *([a-zA-Z0-9_]*) *<: *([a-zA-Z0-9_]*)/g;
const recordTypeDeclRx = /.type *([a-zA-Z0-9_]*) *= *\[([^\]]*)\]/g;

export function lookupType(name: string, env: TypeEnv): DatalogType | undefined {
    if (name === "number") {
        return number;
    }

    if (name === "symbol") {
        return symbol;
    }

    return env.get(name);
}

export function mustLookupType(name: string, env: TypeEnv): DatalogType {
    const res = lookupType(name, env);
    sol.assert(res !== undefined, `Unexpected missing type ${name}.`);
    return res;
}

export function buildTypeEnv(dl: string): TypeEnv {
    const env: TypeEnv = new Map();

    for (const m of dl.matchAll(subtypeDeclRx)) {
        const name = m[1];
        const parentT = lookupType(m[2], env);

        sol.assert(parentT !== undefined, ``);

        env.set(name, new DatalogSubtype(name, parentT));
    }

    for (const m of dl.matchAll(recordTypeDeclRx)) {
        const name = m[1];
        const fields: Array<[string, string]> = m[2].split(",").map((x) =>
            x
                .trim()
                .split(":")
                .map((y) => y.trim())
        ) as Array<[string, string]>;

        const newT = new DatalogRecordType(name, []);
        // First register as record types are recursive
        env.set(name, newT);

        newT.fields = fields.map(([name, typ]) => [name, lookupType(typ, env) as DatalogType]);
    }

    return env;
}

export class DatalogSubtype extends DatalogType {
    constructor(
        name: string,
        public readonly parentT: DatalogType
    ) {
        super(name);
    }

    baseType(): DatalogType {
        let t: DatalogType = this;
        while (t instanceof DatalogSubtype) {
            t = t.parentT;
        }

        return t;
    }
}

export class DatalogRecordType extends DatalogType {
    constructor(
        name: string,
        public fields: Array<[string, DatalogType]>
    ) {
        super(name);
    }
}
