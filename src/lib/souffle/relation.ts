import { DatalogType, TypeEnv, mustLookupType } from "./types";

const declRX = /.decl *([a-zA-Z0-9_]*) *\(([^)]*)\)/g;

export class Relation {
    constructor(
        public readonly name: string,
        public readonly fields: Array<[string, DatalogType]>
    ) {}
}

export function getRelations(dl: string, env: TypeEnv): Relation[] {
    const res: Relation[] = [];

    for (const m of dl.matchAll(declRX)) {
        const name = m[1];
        const args = (
            m[2]
                .split(",")
                .map((x) => x.trim())
                .map((x) => x.split(":")) as Array<[string, string]>
        ).map(([name, rawT]) => [name.trim(), mustLookupType(rawT.trim(), env)]) as Array<
            [string, DatalogType]
        >;

        res.push(new Relation(name, args));
    }

    return res;
}
