import * as sol from "solc-typed-ast";
import { flatten } from "./utils";
import { preamble, translateASTNodeInternal } from "../gen";

function facts(units: sol.SourceUnit[], infer: sol.InferType): string[] {
    const res = flatten(units.map((unit) => translateUnit(unit, infer)));

    const version = infer.version.split(".").map((x) => Number(x));

    sol.assert(version.length === 3, `Expected version tripple not ${infer.version}`);
    res.push(`CompilerVersion(${version[0]}, ${version[1]}, ${version[2]}).`);

    return res;
}

export function datalogFromUnits(units: sol.SourceUnit[], infer: sol.InferType): string {
    return [
        "// ======= PREAMBLE =======",
        preamble,
        "// ======= FACTS =======",
        ...facts(units, infer)
    ].join("\n");
}

/**
 * typeString's behavior is inconsistent across AST versions. Sometimes it can be
 * null or undefined. Normalize to ""
 */
function translateNode(nd: sol.ASTNode, infer: sol.InferType): string[] {
    const res: string[] = [];

    if (nd.parent) {
        res.push(`parent(${nd.parent.id}, ${nd.id}).`);
    }

    res.push(...translateASTNodeInternal(nd, infer));
    return res;
}

/**
 * Walk a block, skipping any nested/empty blocks and return a list of the
 * top-level statements in the block in order. So for example for:
 * ```
 *  {{}}
 *  i=0;
 *  unchecked {{ i++; {} }}
 *  i--;
 *  {}
 * ```
 *
 * This function will return [`i=0`, `i++`, `i--`]
 */
function linearizeStmts(nd: sol.Block | sol.UncheckedBlock): sol.Statement[] {
    const res: sol.Statement[] = [];

    for (const stmt of nd.vStatements) {
        if (stmt instanceof sol.Block || stmt instanceof sol.UncheckedBlock) {
            res.push(...linearizeStmts(stmt));
        } else if (stmt instanceof sol.Statement) {
            res.push(stmt);
        }
    }

    return res;
}

function translateUnit(unit: sol.SourceUnit, infer: sol.InferType): string[] {
    const res: string[] = [];

    unit.walk((nd) => res.push(...translateNode(nd, infer)));

    // Add firstStmt and nextStmt
    unit.walk((nd) => {
        if (!(nd instanceof sol.Block || nd instanceof sol.UncheckedBlock)) {
            return;
        }

        const stmts = linearizeStmts(nd);

        if (stmts.length > 0) {
            res.push(`firstStmt(${nd.id}, ${stmts[0].id}).`);
            res.push(`lastStmt(${nd.id}, ${stmts[stmts.length - 1].id}).`);
        }

        for (let i = 0; i < stmts.length - 1; i++) {
            res.push(`nextStmt(${stmts[i].id}, ${stmts[i + 1].id}).`);
        }
    });

    return res;
}
