import { assert, ASTContext, ASTNode, FunctionDefinition } from "solc-typed-ast";
import * as DL from "souffle.ts";
import { pp } from "./pp";

export type RelationFieldObj = { [key: string]: RelationField };
export type RelationField =
    | ASTNode
    | string
    | number
    | boolean
    | ASTNode[]
    | RelationFieldObj
    | RelationFieldObj[]
    | null;

const stringTypeAliases = new Set([
    "ContractKind",
    "LiteralKind",
    "TimeUnit",
    "EtherUnit",
    "FunctionCallKind",
    "DataLocation",
    "Mutability",
    "FunctionStateMutability",
    "FunctionKind",
    "ModifierInvocationKind",
    "StateVariableVisibility",
    "FunctionVisibility",
    "ElementaryTypeNameMutability",
    "SubdenominationT"
]);

function liftValue(val: DL.FieldVal, type: DL.DatalogType, ctx: ASTContext): RelationField {
    if (type === DL.SymbolT) {
        assert(typeof val === "string", `Type mismatch. Expected string not {0}`, val as any);
        return val;
    }

    if (type === DL.NumberT) {
        assert(
            typeof val === "number" || typeof val === "bigint",
            `Type mismatch. Expected number-like not {0}`,
            val as any
        );
        return Number(val);
    }

    if (type instanceof DL.SubT) {
        if (type.name === "bool") {
            assert(typeof val === "number", `Type mismatch. Expected number not {0}`, val as any);
            return val === 1;
        }

        if (stringTypeAliases.has(type.name)) {
            assert(typeof val === "string", `Type mismatch. Expected string not {0}`, val as any);
            return val;
        }
        if (type.name === "id" || type.name.endsWith("Id")) {
            // ASTNode
            assert(
                typeof val === "number" || typeof val === "bigint",
                `Type mismatch. Expected number-like not {0}`,
                val as any
            );
            return ctx.locate(Number(val));
        }

        if (type.name.endsWith("Id")) {
            // ASTNode
            assert(
                typeof val === "number" || typeof val === "bigint",
                `Type mismatch. Expected number-like not {0}`,
                val as any
            );
            return ctx.locate(Number(val));
        }
    }

    if (type instanceof DL.RecordT) {
        if (type.name === "NumPath") {
            const res: ASTNode[] = [];

            while (val !== null) {
                const node = ctx.locate(Number((val as DL.RecordVal).head));
                res.push(node);
                val = (val as DL.RecordVal).tail;
            }

            return res;
        }

        if (type.name === "Context") {
            if (val === null) {
                return null;
            }

            const recVal = val as DL.RecordVal;
            const contract = ctx.locate(Number(recVal.mdc));
            let rawCallList = recVal.callList as DL.RecordVal | null;
            const callList: RelationFieldObj[] = [];

            while (rawCallList !== null) {
                const head = rawCallList.head as DL.ADTVal;
                switch (head[0]) {
                    case "Node":
                        callList.push({ type: "Node", id: ctx.locate(Number(head[1].id)) });
                        break;
                    case "Call":
                        callList.push({
                            type: "Call",
                            id: ctx.locate(Number(head[1].id)),
                            target: ctx.locate(Number(head[1].target))
                        });
                        break;
                    case "Modifier":
                        callList.push({
                            type: "Modifier",
                            id: ctx.locate(Number(head[1].id)),
                            idx: ctx.locate(Number(head[1].idx))
                        });
                        break;
                    default:
                        assert(false, `Unknown CallListNode ${head[0]}`);
                }
                rawCallList = rawCallList.tail as DL.RecordVal | null;
            }

            return { mdc: contract, callList };
        }
    }

    if (type instanceof DL.ADTT) {
        const res: RelationFieldObj = {};
        const branch = (val as DL.ADTVal)[0];
        const vals = (val as DL.ADTVal)[1];

        res["_branch"] = branch;

        for (const [name, fieldT] of type.branch(branch)) {
            res[name] = liftValue(vals[name], fieldT, ctx);
        }

        return res;
    }

    assert(false, `Unknown datalog type ${type.name}`);
}

function getSource(val: ASTNode, files?: Map<number, Uint8Array>): string {
    const unitId = Number(val["src"].split(":")[2]);
    assert(files !== undefined, `Need a source map to decode source format`);
    const source = files.get(unitId);
    assert(source !== undefined, `Unknown source for SourceUnit with id ${unitId}`);
    return new TextDecoder("utf-8")
        .decode((val as ASTNode).extractSourceFragment(source))
        .replaceAll("\n", "\\n");
}

export class Fact {
    public readonly relation: DL.Relation;
    public readonly args: RelationField[];

    constructor(fact: DL.Fact, ctx: ASTContext) {
        this.relation = fact.relation;
        this.args = fact.fields.map((val, i) => liftValue(val, this.relation.fields[i][1], ctx));
    }

    fmt(message: string, files?: Map<number, Uint8Array>): string {
        for (let i = 0; i < this.args.length; i++) {
            const detail = this.args[i];
            const part = pp(detail);

            message = message.replace(
                new RegExp("\\{" + i + "\\}([.a-zA-Z0-9_]*)", "g"),
                (match, p) => {
                    if (p.length === 0) {
                        return pp(detail);
                    }

                    const components = p.split(".");
                    let val: any = detail;
                    for (const comp of components) {
                        if (comp.length === 0) {
                            continue;
                        }

                        // Special case - if its .source then extract the corresponding source fragment
                        if (comp === "source") {
                            val = getSource(val as ASTNode, files);
                            continue;
                        }

                        if (comp === "interproc_ctx") {
                            if (val === null) {
                                val = "";
                                continue;
                            }

                            const els: string[] = [];
                            for (const node of val.callList) {
                                if (node.type === "Node") {
                                    els.push(getSource(node.id as ASTNode, files));
                                } else if (node.type === "Call") {
                                    els.push(getSource(node.id as ASTNode, files));
                                } else if (node.type === "Modifier") {
                                    const modInv = (node.id as FunctionDefinition).vModifiers[
                                        node.idx
                                    ];
                                    els.push(getSource(modInv, files));
                                } else {
                                    assert(false, `Unknown node type ${node.type}`);
                                }
                            }

                            val = els.join("::");
                            continue;
                        }

                        val = val[comp];
                    }

                    return pp(val);
                }
            );
            message = message.replace(new RegExp("\\{" + i + "\\}", "g"), part);
        }

        return message;
    }
}
