import * as sol from "solc-typed-ast";
import { boolify, flatten, listify } from "./utils";

export function translate(units: sol.SourceUnit[]): string[] {
    return flatten(units.map(translateUnit));
}

function translateExportedSyms(a: Map<string, number>): string {
    if (a.size === 0) {
        return `nil`;
    }

    return [...a.entries()].reduceRight((acc, [name, id]) => `["${name}", ${id}, ${acc}]`, "nil");
}

class Literal {
    constructor(public v: string) {}
}

function translateVal(a: any): string {
    if (typeof a === "string") {
        return `"${a}"`;
    }

    if (typeof a === "boolean") {
        return boolify(a);
    }

    if (typeof a === "number") {
        return `${a}`;
    }

    if (a instanceof sol.ASTNode) {
        return `${a.id}`;
    }

    if (a instanceof Array) {
        return listify(a.map(translateVal));
    }

    if (a instanceof Literal) {
        return a.v;
    }

    throw new Error(`Don't know how to translate ${a}`);
}

function translateVals(...a: any[]): string[] {
    console.error(`translateVals: `, a);
    const res = a.map(translateVal);
    console.error(res);
    return res;
}

export function translateUnit(unit: sol.SourceUnit): string[] {
    const res: string[] = [];

    unit.walk((nd) => {
        if (nd.parent) {
            res.push(`parent(${nd.parent.id}, ${nd.id}).`);
        }

        let args: string[];

        if (nd instanceof sol.SourceUnit) {
            args = translateVals(
                nd.sourceEntryKey,
                nd.sourceListIndex,
                nd.absolutePath,
                new Literal(translateExportedSyms(nd.exportedSymbols))
            );
        } else if (nd instanceof sol.ContractDefinition) {
            args = translateVals(
                nd.name,
                nd.scope,
                nd.kind,
                nd.abstract,
                nd.fullyImplemented,
                nd.vLinearizedBaseContracts,
                nd.vUsedErrors
            );
            return;
        } else if (nd instanceof sol.FunctionDefinition) {
            const overrideSpecId = nd.vOverrideSpecifier ? nd.vOverrideSpecifier.id : -1;
            const bodyId = nd.vBody ? nd.vBody.id : -1;
            args = translateVals(
                nd.scope,
                nd.kind,
                nd.name,
                nd.virtual,
                nd.visibility,
                nd.stateMutability,
                nd.isConstructor,
                nd.vParameters,
                nd.vReturnParameters,
                nd.vModifiers,
                overrideSpecId,
                overrideSpecId !== -1,
                bodyId,
                bodyId !== -1
            );
        } else if (nd instanceof sol.VariableDeclaration) {
            const typeNameId = nd.vType === undefined ? -1 : nd.vType.id;
            const overrideSpecId = nd.vOverrideSpecifier ? nd.vOverrideSpecifier.id : -1;
            const valId = nd.vValue === undefined ? -1 : nd.vValue;
            args = translateVals(
                nd.constant,
                nd.indexed,
                nd.name,
                nd.scope,
                nd.stateVariable,
                nd.storageLocation,
                nd.visibility,
                nd.mutability,
                nd.typeString,
                typeNameId,
                typeNameId !== -1,
                overrideSpecId,
                overrideSpecId !== -1,
                valId,
                valId !== -1
            );
        } else if (nd instanceof sol.ElementaryTypeName) {
            args = translateVals(nd.typeString, nd.name, nd.stateMutability);
        } else if (nd instanceof sol.ParameterList) {
            args = translateVals(nd.vParameters);
        } else if (nd instanceof sol.Block) {
            args = translateVals(nd.vStatements);
        } else if (nd instanceof sol.ExpressionStatement) {
            args = translateVals(nd.vExpression);
        } else if (nd instanceof sol.Assignment) {
            args = translateVals(nd.typeString, nd.operator, nd.vLeftHandSide, nd.vRightHandSide);
        } else if (nd instanceof sol.BinaryOperation) {
            args = translateVals(
                nd.typeString,
                nd.operator,
                nd.vLeftExpression,
                nd.vRightExpression
            );
        } else if (nd instanceof sol.Identifier) {
            args = translateVals(nd.typeString, nd.name, nd.referencedDeclaration);
        } else {
            throw new Error(`NYI emitting facts for ${sol.pp(nd)}`);
        }

        // Prepend id and src present on all nodes
        args.unshift(...translateVals(nd.id, nd.src));

        res.push(`${nd.constructor.name}(${args.join(", ")}).`);
    });

    return res;
}
