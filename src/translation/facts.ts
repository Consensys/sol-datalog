import { ASTNode, fmt } from "solc-typed-ast";

export function facts(node: ASTNode): string[] {
    throw new Error(fmt("Unable to produce facts from node {0}", node));
}
