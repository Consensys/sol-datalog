import * as sol from "solc-typed-ast";
import { flatten } from "./utils";
import { translateASTNodeInternal } from "../gen";

export function translate(units: sol.SourceUnit[]): string[] {
    return flatten(units.map(translateUnit));
}

/**
 * typeString's behavior is inconsistent across AST versions. Sometimes it can be
 * null or undefined. Normalize to ""
 */
function translateNode(nd: sol.ASTNode): string[] {
    const res: string[] = [];

    if (nd.parent) {
        res.push(`parent(${nd.parent.id}, ${nd.id}).`);
    }

    res.push(translateASTNodeInternal(nd));
    return res;
}

function translateUnit(unit: sol.SourceUnit): string[] {
    const res: string[] = [];

    unit.walk((nd) => res.push(...translateNode(nd)));

    return res;
}
