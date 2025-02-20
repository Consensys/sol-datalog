import * as dl from "souffle.ts";

export const ANALYSES_DIR = __dirname;

const IdT = new dl.SubT("id", dl.NumberT);
const ContractDefinitionId = new dl.SubT("ContractDefinitionId", IdT);
const NumPathT = new dl.RecordT("NumPath", [["head", dl.NumberT]]);
// Note NumPathT is recursive
NumPathT.fields.push(["tail", NumPathT]);

export const AVAILABLE_ANALYSES: dl.Relation[] = [
    new dl.Relation("cg.edge", [
        ["from", IdT],
        ["to", IdT]
    ]),
    new dl.Relation("cg.path", [
        ["from", IdT],
        ["to", IdT],
        ["path", NumPathT]
    ]),
    new dl.Relation("inh.inherits", [
        ["childContractId", ContractDefinitionId],
        ["baseContractId", ContractDefinitionId]
    ]),
    new dl.Relation("inh.inheritsStrict", [
        ["childContractId", ContractDefinitionId],
        ["baseContractId", ContractDefinitionId]
    ]),
    new dl.Relation("inh.overrides", [
        ["childNode", IdT],
        ["baseFun", IdT]
    ]),
    new dl.Relation("cfg.dom.dominateStmt", [
        ["pred", IdT],
        ["succ", IdT]
    ]),
    new dl.Relation("cfg.dom.dominate", [
        ["pred", IdT],
        ["succ", IdT]
    ]),
    new dl.Relation("cfg.succ.succ", [
        ["prev", IdT],
        ["next", IdT]
    ]),
    new dl.Relation("cfg.succ.succ_first", [
        ["prev", IdT],
        ["next", IdT]
    ])
];

const NAME_TO_RELN = new Map<string, dl.Relation>(AVAILABLE_ANALYSES.map((r) => [r.name, r]));

export function getRelation(name: string): dl.Relation {
    const res = NAME_TO_RELN.get(name);
    dl.assert(res !== undefined, `Unknown analysis relation ${name}`);
    return res;
}
