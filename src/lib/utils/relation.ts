import { assert, ASTContext, ASTNode, ASTNodeConstructor, pp, PPIsh } from "solc-typed-ast";
import * as DL from "souffle.ts";

export type RelationFieldT = ASTNodeConstructor<ASTNode> | string;
export type RelationField = ASTNode | string | number | bigint;

function fmt(message: string, ...details: PPIsh[]): string {
    for (let i = 0; i < details.length; i++) {
        const detail = details[i];
        const part = pp(detail);

        message = message.replace(new RegExp("\\{" + i + "\\}.name", "g"), (detail as any).name);
        message = message.replace(new RegExp("\\{" + i + "\\}", "g"), part);
    }

    return message;
}

/**
 * Wrapper around lower-level relations
 */
export class Relation {
    public readonly name;
    public readonly args: RelationFieldT[];

    constructor(
        public readonly underlyingRelationName: string,
        public readonly template: string,
        ..._args: RelationFieldT[]
    ) {
        this.args = _args;
        this.name = this.constructor.name;
    }
}

export class Fact {
    public readonly args: RelationField[];

    constructor(
        public readonly relation: Relation,
        fact: DL.Fact,
        ctx: ASTContext
    ) {
        this.args = [];

        assert(
            fact.fields.length === this.relation.args.length,
            `Mismatch in args count between DL fact from relation ${fact.relation.name} and higher-level relaton ${this.relation.name}`
        );

        for (let i = 0; i < fact.fields.length; i++) {
            const t = this.relation.args[i];
            const val = fact.fields[i];

            if (t === "string") {
                assert(
                    typeof val === "string",
                    `Type mismatch. Expected string not {0}`,
                    val as any
                );

                this.args.push(val);
            } else if (t === "number") {
                assert(
                    typeof val === "number",
                    `Type mismatch. Expected string not {0}`,
                    val as any
                );

                this.args.push(val);
            } else if (t === "bigint") {
                assert(
                    typeof val === "bigint",
                    `Type mismatch. Expected string not {0}`,
                    val as any
                );

                this.args.push(val);
            } else {
                assert(
                    typeof val === "number",
                    `Type mismatch. Expected string not {0}`,
                    val as any
                );

                this.args.push(ctx.locate(val));
            }
        }
    }

    pp(): string {
        return fmt(this.relation.template, ...this.args);
    }
}
