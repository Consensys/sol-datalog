import * as sol from "solc-typed-ast";
import { Literal, flatten, translateSymbolsMap, translateVals } from "./utils";

export function translate(units: sol.SourceUnit[]): string[] {
    return flatten(units.map(translateUnit));
}

export function translateNode(nd: sol.ASTNode): string[] {
    const res: string[] = [];

    if (nd.parent) {
        res.push(`parent(${nd.parent.id}, ${nd.id}).`);
    }

    let args: string[];

    if (nd instanceof sol.SourceUnit) {
        args = translateVals(
            nd.sourceEntryKey,
            nd.sourceListIndex,
            nd.absolutePath,
            new Literal(translateSymbolsMap(nd.exportedSymbols))
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
        args = translateVals(nd.typeString, nd.operator, nd.vLeftExpression, nd.vRightExpression);
    } else if (nd instanceof sol.Identifier) {
        args = translateVals(nd.typeString, nd.name, nd.referencedDeclaration);
    } else {
        throw new Error(`NYI emitting facts for ${sol.pp(nd)}`);
    }

    // Prepend id and src present on all nodes
    args.unshift(...translateVals(nd.id, nd.src));

    res.push(`${nd.constructor.name}(${args.join(", ")}).`);

    return res;
}

export function translateUnit(unit: sol.SourceUnit): string[] {
    const res: string[] = [];

    unit.walk((nd) => res.push(...translateNode(nd)));

    return res;
}
