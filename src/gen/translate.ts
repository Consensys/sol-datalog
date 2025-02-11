import * as sol from "solc-typed-ast";
import { sanitizeString, translateVal } from "../lib/utils";

export function translateASTNodeInternal(nd: sol.ASTNode, infer: sol.InferType): string[] {
    const res: string[] = [];
    if (nd instanceof sol.SourceUnit) {
        res.push(`SourceUnit(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (const [k, v] of nd.exportedSymbols.entries()) {
            res.push(`SourceUnit_exportedSymbols(${nd.id}, ${'"' + k + '"'}, ${v}).`);
        }
        res.push(
            `SourceUnit_sourceEntryKey(${nd.id}, ${translateVal(sanitizeString(nd.sourceEntryKey))}).`
        );
        res.push(`SourceUnit_sourceListIndex(${nd.id}, ${translateVal(nd.sourceListIndex)}).`);
        res.push(
            `SourceUnit_absolutePath(${nd.id}, ${translateVal(sanitizeString(nd.absolutePath))}).`
        );
        res.push(
            `SourceUnit_license(${nd.id}, ${translateVal(nd.license === undefined ? "" : sanitizeString(nd.license))}, ${translateVal(nd.license !== undefined)}).`
        );
    } else if (nd instanceof sol.ContractDefinition) {
        res.push(`ContractDefinition(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.linearizedBaseContracts.length; i++) {
            const t = nd.linearizedBaseContracts[i];
            res.push(`ContractDefinition_linearizedBaseContracts(${nd.id}, ${t}, ${i}).`);
        }

        for (let i = 0; i < nd.usedErrors.length; i++) {
            const t = nd.usedErrors[i];
            res.push(`ContractDefinition_usedErrors(${nd.id}, ${t}, ${i}).`);
        }

        for (let i = 0; i < nd.usedEvents.length; i++) {
            const t = nd.usedEvents[i];
            res.push(`ContractDefinition_usedEvents(${nd.id}, ${t}, ${i}).`);
        }
        res.push(`ContractDefinition_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(`ContractDefinition_scope(${nd.id}, ${translateVal(nd.scope)}).`);
        res.push(`ContractDefinition_kind(${nd.id}, ${translateVal(nd.kind)}).`);
        res.push(`ContractDefinition_abstract(${nd.id}, ${translateVal(nd.abstract)}).`);
        res.push(
            `ContractDefinition_fullyImplemented(${nd.id}, ${translateVal(nd.fullyImplemented)}).`
        );
    } else if (nd instanceof sol.VariableDeclaration) {
        res.push(`VariableDeclaration(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`VariableDeclaration_constant(${nd.id}, ${translateVal(nd.constant)}).`);
        res.push(`VariableDeclaration_indexed(${nd.id}, ${translateVal(nd.indexed)}).`);
        res.push(`VariableDeclaration_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(`VariableDeclaration_scope(${nd.id}, ${translateVal(nd.scope)}).`);
        res.push(`VariableDeclaration_stateVariable(${nd.id}, ${translateVal(nd.stateVariable)}).`);
        res.push(
            `VariableDeclaration_storageLocation(${nd.id}, ${translateVal(nd.storageLocation)}).`
        );
        res.push(`VariableDeclaration_visibility(${nd.id}, ${translateVal(nd.visibility)}).`);
        res.push(`VariableDeclaration_mutability(${nd.id}, ${translateVal(nd.mutability)}).`);
        res.push(
            `VariableDeclaration_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(
            `VariableDeclaration_typeName(${nd.id}, ${translateVal(nd.vType === undefined ? -1 : nd.vType)}, ${translateVal(nd.vType !== undefined)}).`
        );
        res.push(
            `VariableDeclaration_overrideSpecifier(${nd.id}, ${translateVal(nd.vOverrideSpecifier === undefined ? -1 : nd.vOverrideSpecifier)}, ${translateVal(nd.vOverrideSpecifier !== undefined)}).`
        );
        res.push(
            `VariableDeclaration_value(${nd.id}, ${translateVal(nd.vValue === undefined ? -1 : nd.vValue)}, ${translateVal(nd.vValue !== undefined)}).`
        );
    } else if (nd instanceof sol.FunctionDefinition) {
        res.push(`FunctionDefinition(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vModifiers.length; i++) {
            const t = nd.vModifiers[i];
            res.push(`FunctionDefinition_modifiers(${nd.id}, ${t.id}, ${i}).`);
        }
        res.push(`FunctionDefinition_scope(${nd.id}, ${translateVal(nd.scope)}).`);
        res.push(`FunctionDefinition_kind(${nd.id}, ${translateVal(nd.kind)}).`);
        res.push(`FunctionDefinition_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(`FunctionDefinition_virtual(${nd.id}, ${translateVal(nd.virtual)}).`);
        res.push(`FunctionDefinition_visibility(${nd.id}, ${translateVal(nd.visibility)}).`);
        res.push(
            `FunctionDefinition_stateMutability(${nd.id}, ${translateVal(nd.stateMutability)}).`
        );
        res.push(`FunctionDefinition_isConstructor(${nd.id}, ${translateVal(nd.isConstructor)}).`);
        res.push(`FunctionDefinition_parameters(${nd.id}, ${translateVal(nd.vParameters)}).`);
        res.push(
            `FunctionDefinition_returnParameters(${nd.id}, ${translateVal(nd.vReturnParameters)}).`
        );
        res.push(
            `FunctionDefinition_overrideSpecifier(${nd.id}, ${translateVal(nd.vOverrideSpecifier === undefined ? -1 : nd.vOverrideSpecifier)}, ${translateVal(nd.vOverrideSpecifier !== undefined)}).`
        );
        res.push(
            `FunctionDefinition_body(${nd.id}, ${translateVal(nd.vBody === undefined ? -1 : nd.vBody)}, ${translateVal(nd.vBody !== undefined)}).`
        );
    } else if (nd instanceof sol.ExpressionStatement) {
        res.push(`ExpressionStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`ExpressionStatement_expression(${nd.id}, ${translateVal(nd.vExpression)}).`);
    } else if (nd instanceof sol.Assignment) {
        res.push(`Assignment(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `Assignment_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`Assignment_operator(${nd.id}, ${translateVal(sanitizeString(nd.operator))}).`);
        res.push(`Assignment_leftHandSide(${nd.id}, ${translateVal(nd.vLeftHandSide)}).`);
        res.push(`Assignment_rightHandSide(${nd.id}, ${translateVal(nd.vRightHandSide)}).`);
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.BinaryOperation) {
        res.push(`BinaryOperation(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `BinaryOperation_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(
            `BinaryOperation_operator(${nd.id}, ${translateVal(sanitizeString(nd.operator))}).`
        );
        res.push(`BinaryOperation_leftExpression(${nd.id}, ${translateVal(nd.vLeftExpression)}).`);
        res.push(
            `BinaryOperation_rightExpression(${nd.id}, ${translateVal(nd.vRightExpression)}).`
        );
        res.push(
            `BinaryOperation_userFunction(${nd.id}, ${translateVal(nd.userFunction === undefined ? -1 : nd.userFunction)}, ${translateVal(nd.userFunction !== undefined)}).`
        );
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.Identifier) {
        res.push(`Identifier(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `Identifier_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`Identifier_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(
            `Identifier_referencedDeclaration(${nd.id}, ${translateVal(nd.referencedDeclaration === undefined ? -1 : nd.referencedDeclaration)}).`
        );
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.FunctionCall) {
        res.push(`FunctionCall(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vArguments.length; i++) {
            const t = nd.vArguments[i];
            res.push(`FunctionCall_arguments(${nd.id}, ${t.id}, ${i}).`);
        }
        if (nd.fieldNames !== undefined) {
            for (let i = 0; i < nd.fieldNames.length; i++) {
                const t = nd.fieldNames[i];
                res.push(`FunctionCall_fieldNames(${nd.id}, ${'"' + t + '"'}, ${i}).`);
            }
        }
        res.push(
            `FunctionCall_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`FunctionCall_kind(${nd.id}, ${translateVal(nd.kind)}).`);
        res.push(`FunctionCall_expression(${nd.id}, ${translateVal(nd.vExpression)}).`);
        if (infer.isFunctionCallExternal(nd)) {
            res.push(`ExternalCall(${nd.id}).`);
        }
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.Literal) {
        res.push(`Literal(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`Literal_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`);
        res.push(`Literal_kind(${nd.id}, ${translateVal(nd.kind)}).`);
        res.push(
            `Literal_hexValue(${nd.id}, ${translateVal(nd.hexValue === null ? "" : sanitizeString(nd.hexValue))}).`
        );
        res.push(
            `Literal_value(${nd.id}, ${translateVal(nd.value === null ? "" : sanitizeString(nd.value))}).`
        );
        res.push(
            `Literal_subdenomination(${nd.id}, ${translateVal(nd.subdenomination === undefined ? "" : nd.subdenomination)}, ${translateVal(nd.subdenomination !== undefined)}).`
        );
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.NewExpression) {
        res.push(`NewExpression(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `NewExpression_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`NewExpression_typeName(${nd.id}, ${translateVal(nd.vTypeName)}).`);
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.Conditional) {
        res.push(`Conditional(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `Conditional_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`Conditional_condition(${nd.id}, ${translateVal(nd.vCondition)}).`);
        res.push(`Conditional_trueExpression(${nd.id}, ${translateVal(nd.vTrueExpression)}).`);
        res.push(`Conditional_falseExpression(${nd.id}, ${translateVal(nd.vFalseExpression)}).`);
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.FunctionCallOptions) {
        res.push(`FunctionCallOptions(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (const [k, v] of nd.vOptionsMap.entries()) {
            res.push(`FunctionCallOptions_options(${nd.id}, ${'"' + k + '"'}, ${v.id}).`);
        }
        res.push(
            `FunctionCallOptions_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`FunctionCallOptions_expression(${nd.id}, ${translateVal(nd.vExpression)}).`);
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.UnaryOperation) {
        res.push(`UnaryOperation(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `UnaryOperation_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`UnaryOperation_prefix(${nd.id}, ${translateVal(nd.prefix)}).`);
        res.push(
            `UnaryOperation_operator(${nd.id}, ${translateVal(sanitizeString(nd.operator))}).`
        );
        res.push(`UnaryOperation_subExpression(${nd.id}, ${translateVal(nd.vSubExpression)}).`);
        res.push(
            `UnaryOperation_userFunction(${nd.id}, ${translateVal(nd.userFunction === undefined ? -1 : nd.userFunction)}, ${translateVal(nd.userFunction !== undefined)}).`
        );
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.IndexAccess) {
        res.push(`IndexAccess(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `IndexAccess_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`IndexAccess_baseExpression(${nd.id}, ${translateVal(nd.vBaseExpression)}).`);
        res.push(
            `IndexAccess_indexExpression(${nd.id}, ${translateVal(nd.vIndexExpression === undefined ? -1 : nd.vIndexExpression)}, ${translateVal(nd.vIndexExpression !== undefined)}).`
        );
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.MemberAccess) {
        res.push(`MemberAccess(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `MemberAccess_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`MemberAccess_expression(${nd.id}, ${translateVal(nd.vExpression)}).`);
        res.push(
            `MemberAccess_memberName(${nd.id}, ${translateVal(sanitizeString(nd.memberName))}).`
        );
        res.push(
            `MemberAccess_referencedDeclaration(${nd.id}, ${translateVal(nd.referencedDeclaration === undefined ? -1 : nd.referencedDeclaration)}).`
        );
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.ElementaryTypeNameExpression) {
        res.push(`ElementaryTypeNameExpression(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `ElementaryTypeNameExpression_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(
            `ElementaryTypeNameExpression_typeName(${nd.id}, ${translateVal(nd.typeName instanceof sol.ElementaryTypeName ? nd.typeName.name : nd.typeName)}).`
        );
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.TupleExpression) {
        res.push(`TupleExpression(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let realI = 0, i = 0; realI < nd.components.length; realI++) {
            const t = nd.components[realI];

            if (t === null || t === undefined) {
                continue;
            }

            res.push(`TupleExpression_components(${nd.id}, ${t}, ${i}, ${realI}).`);
            i++;
        }
        res.push(
            `TupleExpression_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`TupleExpression_isInlineArray(${nd.id}, ${translateVal(nd.isInlineArray)}).`);
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.IndexRangeAccess) {
        res.push(`IndexRangeAccess(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `IndexRangeAccess_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`IndexRangeAccess_baseExpression(${nd.id}, ${translateVal(nd.vBaseExpression)}).`);
        res.push(
            `IndexRangeAccess_startExpression(${nd.id}, ${translateVal(nd.vStartExpression === undefined ? -1 : nd.vStartExpression)}, ${translateVal(nd.vStartExpression !== undefined)}).`
        );
        res.push(
            `IndexRangeAccess_endExpression(${nd.id}, ${translateVal(nd.vEndExpression === undefined ? -1 : nd.vEndExpression)}, ${translateVal(nd.vEndExpression !== undefined)}).`
        );
        if (sol.isConstant(nd)) {
            res.push(`ConstantExpression(${nd.id}).`);
        }
    } else if (nd instanceof sol.ErrorDefinition) {
        res.push(`ErrorDefinition(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`ErrorDefinition_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(`ErrorDefinition_parameters(${nd.id}, ${translateVal(nd.vParameters)}).`);
    } else if (nd instanceof sol.UserDefinedValueTypeDefinition) {
        res.push(`UserDefinedValueTypeDefinition(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `UserDefinedValueTypeDefinition_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`
        );
        res.push(
            `UserDefinedValueTypeDefinition_underlyingType(${nd.id}, ${translateVal(nd.underlyingType)}).`
        );
    } else if (nd instanceof sol.StructDefinition) {
        res.push(`StructDefinition(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vMembers.length; i++) {
            const t = nd.vMembers[i];
            res.push(`StructDefinition_members(${nd.id}, ${t.id}, ${i}).`);
        }
        res.push(`StructDefinition_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(`StructDefinition_scope(${nd.id}, ${translateVal(nd.scope)}).`);
        res.push(
            `StructDefinition_visibility(${nd.id}, ${translateVal(sanitizeString(nd.visibility))}).`
        );
    } else if (nd instanceof sol.EnumDefinition) {
        res.push(`EnumDefinition(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vMembers.length; i++) {
            const t = nd.vMembers[i];
            res.push(`EnumDefinition_members(${nd.id}, ${t.id}, ${i}).`);
        }
        res.push(`EnumDefinition_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
    } else if (nd instanceof sol.EnumValue) {
        res.push(`EnumValue(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`EnumValue_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
    } else if (nd instanceof sol.EventDefinition) {
        res.push(`EventDefinition(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`EventDefinition_anonymous(${nd.id}, ${translateVal(nd.anonymous)}).`);
        res.push(`EventDefinition_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(`EventDefinition_parameters(${nd.id}, ${translateVal(nd.vParameters)}).`);
    } else if (nd instanceof sol.ModifierDefinition) {
        res.push(`ModifierDefinition(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`ModifierDefinition_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(`ModifierDefinition_virtual(${nd.id}, ${translateVal(nd.virtual)}).`);
        res.push(
            `ModifierDefinition_visibility(${nd.id}, ${translateVal(sanitizeString(nd.visibility))}).`
        );
        res.push(`ModifierDefinition_parameters(${nd.id}, ${translateVal(nd.vParameters)}).`);
        res.push(
            `ModifierDefinition_overrideSpecifier(${nd.id}, ${translateVal(nd.vOverrideSpecifier === undefined ? -1 : nd.vOverrideSpecifier)}, ${translateVal(nd.vOverrideSpecifier !== undefined)}).`
        );
        res.push(
            `ModifierDefinition_body(${nd.id}, ${translateVal(nd.vBody === undefined ? -1 : nd.vBody)}, ${translateVal(nd.vBody !== undefined)}).`
        );
    } else if (nd instanceof sol.Mapping) {
        res.push(`Mapping(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`Mapping_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`);
        res.push(`Mapping_keyType(${nd.id}, ${translateVal(nd.vKeyType)}).`);
        res.push(`Mapping_valueType(${nd.id}, ${translateVal(nd.vValueType)}).`);
    } else if (nd instanceof sol.FunctionTypeName) {
        res.push(`FunctionTypeName(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `FunctionTypeName_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`FunctionTypeName_visibility(${nd.id}, ${translateVal(nd.visibility)}).`);
        res.push(
            `FunctionTypeName_stateMutability(${nd.id}, ${translateVal(nd.stateMutability)}).`
        );
        res.push(`FunctionTypeName_parameterTypes(${nd.id}, ${translateVal(nd.vParameterTypes)}).`);
        res.push(
            `FunctionTypeName_returnParameterTypes(${nd.id}, ${translateVal(nd.vReturnParameterTypes)}).`
        );
    } else if (nd instanceof sol.ElementaryTypeName) {
        res.push(`ElementaryTypeName(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `ElementaryTypeName_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`ElementaryTypeName_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(
            `ElementaryTypeName_stateMutability(${nd.id}, ${translateVal(nd.stateMutability)}).`
        );
    } else if (nd instanceof sol.ArrayTypeName) {
        res.push(`ArrayTypeName(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `ArrayTypeName_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(`ArrayTypeName_baseType(${nd.id}, ${translateVal(nd.vBaseType)}).`);
        res.push(
            `ArrayTypeName_length(${nd.id}, ${translateVal(nd.vLength === undefined ? -1 : nd.vLength)}, ${translateVal(nd.vLength !== undefined)}).`
        );
    } else if (nd instanceof sol.UserDefinedTypeName) {
        res.push(`UserDefinedTypeName(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `UserDefinedTypeName_typeString(${nd.id}, ${translateVal(sanitizeString(nd.typeString))}).`
        );
        res.push(
            `UserDefinedTypeName_name(${nd.id}, ${translateVal(nd.name === undefined ? "" : sanitizeString(nd.name))}, ${translateVal(nd.name !== undefined)}).`
        );
        res.push(
            `UserDefinedTypeName_referencedDeclaration(${nd.id}, ${translateVal(nd.referencedDeclaration === undefined ? -1 : nd.referencedDeclaration)}).`
        );
        res.push(
            `UserDefinedTypeName_path(${nd.id}, ${translateVal(nd.path === undefined ? -1 : nd.path)}, ${translateVal(nd.path !== undefined)}).`
        );
    } else if (nd instanceof sol.ForStatement) {
        res.push(`ForStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`ForStatement_body(${nd.id}, ${translateVal(nd.vBody)}).`);
        res.push(
            `ForStatement_initializationExpression(${nd.id}, ${translateVal(nd.vInitializationExpression === undefined ? -1 : nd.vInitializationExpression)}, ${translateVal(nd.vInitializationExpression !== undefined)}).`
        );
        res.push(
            `ForStatement_condition(${nd.id}, ${translateVal(nd.vCondition === undefined ? -1 : nd.vCondition)}, ${translateVal(nd.vCondition !== undefined)}).`
        );
        res.push(
            `ForStatement_loopExpression(${nd.id}, ${translateVal(nd.vLoopExpression === undefined ? -1 : nd.vLoopExpression)}, ${translateVal(nd.vLoopExpression !== undefined)}).`
        );
    } else if (nd instanceof sol.TryStatement) {
        res.push(`TryStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vClauses.length; i++) {
            const t = nd.vClauses[i];
            res.push(`TryStatement_clauses(${nd.id}, ${t.id}, ${i}).`);
        }
        res.push(`TryStatement_externalCall(${nd.id}, ${translateVal(nd.vExternalCall)}).`);
    } else if (nd instanceof sol.Throw) {
        res.push(`Throw(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
    } else if (nd instanceof sol.Break) {
        res.push(`Break(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
    } else if (nd instanceof sol.EmitStatement) {
        res.push(`EmitStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`EmitStatement_eventCall(${nd.id}, ${translateVal(nd.vEventCall)}).`);
    } else if (nd instanceof sol.InlineAssembly) {
        res.push(`InlineAssembly(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
    } else if (nd instanceof sol.Block) {
        res.push(`Block(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vStatements.length; i++) {
            const t = nd.vStatements[i];
            res.push(`Block_statements(${nd.id}, ${t.id}, ${i}).`);
        }
    } else if (nd instanceof sol.RevertStatement) {
        res.push(`RevertStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`RevertStatement_errorCall(${nd.id}, ${translateVal(nd.errorCall)}).`);
    } else if (nd instanceof sol.UncheckedBlock) {
        res.push(`UncheckedBlock(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vStatements.length; i++) {
            const t = nd.vStatements[i];
            res.push(`UncheckedBlock_statements(${nd.id}, ${t.id}, ${i}).`);
        }
    } else if (nd instanceof sol.Return) {
        res.push(`Return(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `Return_functionReturnParameters(${nd.id}, ${translateVal(nd.functionReturnParameters)}).`
        );
        res.push(
            `Return_expression(${nd.id}, ${translateVal(nd.vExpression === undefined ? -1 : nd.vExpression)}, ${translateVal(nd.vExpression !== undefined)}).`
        );
    } else if (nd instanceof sol.WhileStatement) {
        res.push(`WhileStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`WhileStatement_condition(${nd.id}, ${translateVal(nd.vCondition)}).`);
        res.push(`WhileStatement_body(${nd.id}, ${translateVal(nd.vBody)}).`);
    } else if (nd instanceof sol.VariableDeclarationStatement) {
        res.push(`VariableDeclarationStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let realI = 0, i = 0; realI < nd.assignments.length; realI++) {
            const t = nd.assignments[realI];

            if (t === null || t === undefined) {
                continue;
            }

            res.push(`VariableDeclarationStatement_assignments(${nd.id}, ${t}, ${i}, ${realI}).`);
            i++;
        }

        for (let i = 0; i < nd.vDeclarations.length; i++) {
            const t = nd.vDeclarations[i];
            res.push(`VariableDeclarationStatement_declarations(${nd.id}, ${t.id}, ${i}).`);
        }
        res.push(
            `VariableDeclarationStatement_initialValue(${nd.id}, ${translateVal(nd.vInitialValue === undefined ? -1 : nd.vInitialValue)}, ${translateVal(nd.vInitialValue !== undefined)}).`
        );
    } else if (nd instanceof sol.IfStatement) {
        res.push(`IfStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`IfStatement_condition(${nd.id}, ${translateVal(nd.vCondition)}).`);
        res.push(`IfStatement_trueBody(${nd.id}, ${translateVal(nd.vTrueBody)}).`);
        res.push(
            `IfStatement_falseBody(${nd.id}, ${translateVal(nd.vFalseBody === undefined ? -1 : nd.vFalseBody)}, ${translateVal(nd.vFalseBody !== undefined)}).`
        );
    } else if (nd instanceof sol.TryCatchClause) {
        res.push(`TryCatchClause(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `TryCatchClause_errorName(${nd.id}, ${translateVal(sanitizeString(nd.errorName))}).`
        );
        res.push(`TryCatchClause_block(${nd.id}, ${translateVal(nd.vBlock)}).`);
        res.push(
            `TryCatchClause_parameters(${nd.id}, ${translateVal(nd.vParameters === undefined ? -1 : nd.vParameters)}, ${translateVal(nd.vParameters !== undefined)}).`
        );
    } else if (nd instanceof sol.DoWhileStatement) {
        res.push(`DoWhileStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`DoWhileStatement_condition(${nd.id}, ${translateVal(nd.vCondition)}).`);
        res.push(`DoWhileStatement_body(${nd.id}, ${translateVal(nd.vBody)}).`);
    } else if (nd instanceof sol.Continue) {
        res.push(`Continue(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
    } else if (nd instanceof sol.PlaceholderStatement) {
        res.push(`PlaceholderStatement(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
    } else if (nd instanceof sol.ParameterList) {
        res.push(`ParameterList(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vParameters.length; i++) {
            const t = nd.vParameters[i];
            res.push(`ParameterList_parameters(${nd.id}, ${t.id}, ${i}).`);
        }
    } else if (nd instanceof sol.InheritanceSpecifier) {
        res.push(`InheritanceSpecifier(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vArguments.length; i++) {
            const t = nd.vArguments[i];
            res.push(`InheritanceSpecifier_arguments(${nd.id}, ${t.id}, ${i}).`);
        }
        res.push(`InheritanceSpecifier_baseType(${nd.id}, ${translateVal(nd.vBaseType)}).`);
    } else if (nd instanceof sol.UsingForDirective) {
        res.push(`UsingForDirective(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        if (nd.vFunctionList !== undefined) {
            for (let i = 0; i < nd.vFunctionList.length; i++) {
                const t = nd.vFunctionList[i];
                res.push(
                    `UsingForDirective_functionList(${nd.id}, ${t instanceof sol.ASTNode ? t.id : t.definition.id}, ${t instanceof sol.ASTNode ? '""' : `"${t.operator}"`}, ${i}).`
                );
            }
        }
        res.push(`UsingForDirective_isGlobal(${nd.id}, ${translateVal(nd.isGlobal)}).`);
        res.push(
            `UsingForDirective_libraryName(${nd.id}, ${translateVal(nd.vLibraryName === undefined ? -1 : nd.vLibraryName)}, ${translateVal(nd.vLibraryName !== undefined)}).`
        );
        res.push(
            `UsingForDirective_typeName(${nd.id}, ${translateVal(nd.vTypeName === undefined ? -1 : nd.vTypeName)}, ${translateVal(nd.vTypeName !== undefined)}).`
        );
    } else if (nd instanceof sol.IdentifierPath) {
        res.push(`IdentifierPath(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`IdentifierPath_name(${nd.id}, ${translateVal(sanitizeString(nd.name))}).`);
        res.push(
            `IdentifierPath_referencedDeclaration(${nd.id}, ${translateVal(nd.referencedDeclaration === undefined ? -1 : nd.referencedDeclaration)}).`
        );
    } else if (nd instanceof sol.PragmaDirective) {
        res.push(`PragmaDirective(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.literals.length; i++) {
            const t = nd.literals[i];
            res.push(`PragmaDirective_literals(${nd.id}, ${'"' + t + '"'}, ${i}).`);
        }
    } else if (nd instanceof sol.ModifierInvocation) {
        res.push(`ModifierInvocation(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vArguments.length; i++) {
            const t = nd.vArguments[i];
            res.push(`ModifierInvocation_arguments(${nd.id}, ${t.id}, ${i}).`);
        }
        res.push(`ModifierInvocation_modifierName(${nd.id}, ${translateVal(nd.vModifierName)}).`);
        res.push(
            `ModifierInvocation_kind(${nd.id}, ${translateVal(nd.kind === undefined ? "" : nd.kind)}, ${translateVal(nd.kind !== undefined)}).`
        );
    } else if (nd instanceof sol.ImportDirective) {
        res.push(`ImportDirective(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(`ImportDirective_file(${nd.id}, ${translateVal(sanitizeString(nd.file))}).`);
        res.push(
            `ImportDirective_absolutePath(${nd.id}, ${translateVal(sanitizeString(nd.absolutePath))}).`
        );
        res.push(
            `ImportDirective_unitAlias(${nd.id}, ${translateVal(sanitizeString(nd.unitAlias))}).`
        );
        res.push(`ImportDirective_scope(${nd.id}, ${translateVal(nd.scope)}).`);
        res.push(`ImportDirective_sourceUnit(${nd.id}, ${translateVal(nd.sourceUnit)}).`);
    } else if (nd instanceof sol.OverrideSpecifier) {
        res.push(`OverrideSpecifier(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);

        for (let i = 0; i < nd.vOverrides.length; i++) {
            const t = nd.vOverrides[i];
            res.push(`OverrideSpecifier_overrides(${nd.id}, ${t.id}, ${i}).`);
        }
    } else if (nd instanceof sol.StructuredDocumentation) {
        res.push(`StructuredDocumentation(${nd.id}).`);
        res.push(`src(${nd.id}, "${nd.src}").`);
        res.push(
            `StructuredDocumentation_text(${nd.id}, ${translateVal(sanitizeString(nd.text))}).`
        );
    } else {
        throw new Error(`Unknown AST node type ${nd.constructor.name}.`);
    }
    return res;
}
