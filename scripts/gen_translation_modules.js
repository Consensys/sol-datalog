const { assert } = require("console");
const path = require("path");
const fse = require("fs-extra");

require("dotenv").config();

/**
 * @todo: Consider to use following (plus, change .ts to .d.ts)
 *
 * const solAstDir = path.dirname(require.resolve("solc-typed-ast"));
 */
const solAstDir = process.env["SOLC_TYPED_AST_DIR"];

const astFiles = [
    "ast/implementation/meta/source_unit.ts",
    "ast/implementation/declaration/contract_definition.ts",
    "ast/implementation/declaration/variable_declaration.ts",
    "ast/implementation/declaration/function_definition.ts",
    "ast/implementation/statement/expression_statement.ts",
    "ast/implementation/expression/assignment.ts",
    "ast/implementation/expression/binary_operation.ts",
    "ast/implementation/expression/identifier.ts",
    "ast/implementation/expression/function_call.ts",
    "ast/implementation/expression/literal.ts",
    "ast/implementation/expression/new_expression.ts",
    "ast/implementation/expression/conditional.ts",
    "ast/implementation/expression/function_call_options.ts",
    "ast/implementation/expression/unary_operation.ts",
    "ast/implementation/expression/index_access.ts",
    "ast/implementation/expression/primary_expression.ts",
    "ast/implementation/expression/member_access.ts",
    "ast/implementation/expression/expression.ts",
    "ast/implementation/expression/elementary_type_name_expression.ts",
    "ast/implementation/expression/tuple_expression.ts",
    "ast/implementation/expression/index_range_access.ts",
    "ast/implementation/declaration/error_definition.ts",
    "ast/implementation/declaration/user_defined_value_type_definition.ts",
    "ast/implementation/declaration/struct_definition.ts",
    "ast/implementation/declaration/enum_definition.ts",
    "ast/implementation/declaration/enum_value.ts",
    "ast/implementation/declaration/event_definition.ts",
    "ast/implementation/declaration/modifier_definition.ts",
    "ast/implementation/type/mapping.ts",
    "ast/implementation/type/function_type_name.ts",
    "ast/implementation/type/elementary_type_name.ts",
    "ast/implementation/type/array_type_name.ts",
    "ast/implementation/type/type_name.ts",
    "ast/implementation/type/user_defined_type_name.ts",
    "ast/implementation/statement/for_statement.ts",
    "ast/implementation/statement/try_statement.ts",
    "ast/implementation/statement/throw.ts",
    "ast/implementation/statement/break.ts",
    "ast/implementation/statement/emit_statement.ts",
    "ast/implementation/statement/statement.ts",
    "ast/implementation/statement/inline_assembly.ts",
    "ast/implementation/statement/block.ts",
    "ast/implementation/statement/revert_statement.ts",
    "ast/implementation/statement/unchecked_block.ts",
    "ast/implementation/statement/return.ts",
    "ast/implementation/statement/while_statement.ts",
    "ast/implementation/statement/variable_declaration_statement.ts",
    "ast/implementation/statement/if_statement.ts",
    "ast/implementation/statement/try_catch_clause.ts",
    "ast/implementation/statement/do_while_statement.ts",
    "ast/implementation/statement/continue.ts",
    "ast/implementation/statement/placeholder_statement.ts",
    "ast/implementation/meta/parameter_list.ts",
    "ast/implementation/meta/inheritance_specifier.ts",
    "ast/implementation/meta/using_for_directive.ts",
    "ast/implementation/meta/identifier_path.ts",
    "ast/implementation/meta/pragma_directive.ts",
    "ast/implementation/meta/modifier_invocation.ts",
    "ast/implementation/meta/import_directive.ts",
    "ast/implementation/meta/override_specifier.ts",
    "ast/implementation/meta/structured_documentation.ts"
].map((v) => path.join(solAstDir, v));

let modules;

const staticPreamble = `
.type id <: number
.type bool <: number
.type ExpressionId <: id
.type StatementId <: id
.type TypeNameId <: id

.type ContractKind <: symbol
.type LiteralKind <: symbol
.type TimeUnit <: symbol
.type EtherUnit <: symbol
.type FunctionCallKind <: symbol
.type DataLocation <: symbol
.type Mutability <: symbol
.type FunctionStateMutability <: symbol
.type FunctionKind <: symbol
.type ModifierInvocationKind <: symbol
.type StateVariableVisibility <: symbol
.type FunctionVisibility <: symbol
.type ElementaryTypeNameMutability <: symbol

.type SubdenominationT <: symbol

.decl parent(parentId: id, childId: id)
.decl src(id: id, src: symbol)
.decl Node(id: id)
.decl externalCall(id: FunctionCallId)
.decl ConstantExpression(id: id)
.decl CompilerVersion(major: number, minor: number, patch: number)
.decl Expression(id: id)
.decl Statement(id: id)
.decl StatementWithChildren(id: id)
.decl PrimaryExpression(id: id)
.decl TypeName(id: id)
.decl ContractDefinition_linearizedBaseContracts(parentId: ContractDefinitionId, childId: ContractDefinitionId, idx: number)
.decl ContractDefinition_usedErrors(parentId: ContractDefinitionId, childId: ErrorDefinitionId, idx: number)
.decl ContractDefinition_usedEvents(parentId: ContractDefinitionId, childId: EventDefinitionId, idx: number)
.decl TupleExpression_components(parentId: TupleExpressionId, childId: ExpressionId, idx: number, realIdx: number)
.decl FunctionDefinition_modifiers(parentId: FunctionDefinitionId, childId: ModifierInvocationId, idx: number)
.decl FunctionCall_arguments(parentId: FunctionCallId, childId: ExpressionId, idx: number)
.decl TryStatement_clauses(parentId: TryStatementId, childId: TryCatchClauseId, idx: number)
.decl VariableDeclarationStatement_declarations(parentId: VariableDeclarationStatementId, childId: VariableDeclarationId, idx: number)
.decl InheritanceSpecifier_arguments(parentId: InheritanceSpecifierId, childId: ExpressionId, idx: number)
.decl ModifierInvocation_arguments(parentId: ModifierInvocationId, childId: ExpressionId, idx: number)
.decl ParameterList_parameters(parentId: ParameterListId, childId: VariableDeclarationId, idx: number)
.decl Block_statements(parentId: BlockId, childId: StatementId, idx: number)
.decl UncheckedBlock_statements(parentId: UncheckedBlockId, childId: StatementId, idx: number)
.decl UsingForDirective_functionList(parentId: UsingForDirectiveId, childId: IdentifierPathId, operator: symbol, idx: number)
.decl StructDefinition_members(parentId: StructDefinitionId, childId: VariableDeclarationId, idx: number)
.decl EnumDefinition_members(parentId: EnumDefinitionId, childId: EnumValueId, idx: number)
.decl VariableDeclarationStatement_assignments(parentId: VariableDeclarationStatementId, childId: VariableDeclarationId, idx: number, realIdx: number)
.decl OverrideSpecifier_overrides(parentId: OverrideSpecifierId, childId: id, idx: number)

.decl FunctionCall_fieldNames(parentId: FunctionCallId, name: symbol, idx: number)
.decl PragmaDirective_literals(parentId: FunctionCallId, literal: symbol, idx: number)
.decl SourceUnit_exportedSymbols(parentId: SourceUnitId, name: symbol, id: id)
.decl FunctionCallOptions_options(parentId: FunctionCallOptionsId, name: symbol, id: id)
.decl FunctionDefinition_signature(funId: FunctionDefinitionId, signature: symbol)
.decl FunctionDefinition_signatureHash(funId: FunctionDefinitionId, signature: symbol)
.decl VariableDeclaration_signature(varId: VariableDeclarationId, signature: symbol)
.decl VariableDeclaration_signatureHash(varId: VariableDeclarationId, signature: symbol)
`;

const skipFields = ["raw", "documentation", "nameLocation", "children", "src"];
const skipClassFieldsM = new Map([
    ["ContractDefinition", ["linearizedBaseContracts", "usedErrors", "usedEvents"]],
    ["TupleExpression", ["components"]],
    // @todo add inline assembly
    ["InlineAssembly", [`externalReferences`, `operations`, `flags`, `yul`, `evmVersion`]],
    // @todo add symbolAliases
    ["ImportDirective", ["symbolAliases"]],
    ["FunctionDefinition", ["modifiers"]],
    ["FunctionCall", ["args", "fieldNames"]],
    ["TryStatement", ["clauses"]],
    ["VariableDeclarationStatement", ["declarations", "assignments"]],
    ["InheritanceSpecifier", ["args"]],
    ["ModifierInvocation", ["args"]],
    ["ParameterList", ["parameters"]],
    ["OverrideSpecifier", ["overrides"]],
    ["Block", ["statements"]],
    ["UncheckedBlock", ["statements"]],
    ["PragmaDirective", ["literals"]],
    ["StructDefinition", ["members"]],
    ["EnumDefinition", ["members"]],
    ["UsingForDirective", ["functionList"]],
    ["SourceUnit", ["exportedSymbols"]],
    ["FunctionCallOptions", ["options"]]
]);

function shouldSkipField(className, fieldName) {
    if (skipFields.includes(fieldName)) {
        return true;
    }

    const t = skipClassFieldsM.get(className);

    if (t && t.includes(fieldName)) {
        return true;
    }

    return false;
}

// @todo cleanup
const astClassNames = new Set(["ASTNodeWithChildren", "ASTNode", "StatementWithChildren"]);
const abstractClassNames = new Set([
    "ASTNodeWithChildren",
    "ASTNode",
    "Expression",
    "Statement",
    "PrimaryExpression",
    "StatementWithChildren",
    "TypeName"
]);
const simpleTypeMap = new Map([
    ["number", "number"],
    ["string", "symbol"],
    ["boolean", "bool"],
    ["FunctionCallKind", "FunctionCallKind"],
    ["ContractKind", "ContractKind"],
    ["DataLocation", "DataLocation"],
    ["StateVariableVisibility", "StateVariableVisibility"],
    ["Mutability", "Mutability"],
    ["FunctionKind", "FunctionKind"],
    ["FunctionVisibility", "FunctionVisibility"],
    ["FunctionStateMutability", "FunctionStateMutability"],
    ["LiteralKind", "LiteralKind"],
    ["ModifierInvocationKind", "ModifierInvocationKind"]
]);

const abstractASTNodeToIdType = new Map([
    ["ASTNode", "id"],
    ["ASTNodeWithChildren", "id"],
    ["Expression", "ExpressionId"],
    ["Statement", "StatementId"],
    ["StatementWithChildren", "StatementId"],
    ["PrimaryExpression", "ExpressionId"],
    ["TypeName", "TypeNameId"]
]);

const iterableRE = /Iterable<(.*)>/;

function translateType(tsT) {
    if (simpleTypeMap.has(tsT)) {
        return simpleTypeMap.get(tsT);
    }

    if (astClassNames.has(tsT)) {
        return `${tsT}Id`;
    }

    if (tsT.endsWith(" | undefined")) {
        const baseName = tsT.slice(0, -12);
        if (astClassNames.has(baseName)) {
            return `${baseName}Id`;
        }
    }

    throw new Error(`Can't translate type ${tsT}`);
}

const arrayFieldsToBaseTypesM = new Map([
    [
        "ContractDefinition",
        new Map([
            ["linearizedBaseContracts", "ContractDefinition"],
            ["usedErrors", "ErrorDefinition"],
            ["usedEvents", "EventDefintion"]
        ])
    ],
    ["TupleExpression", new Map([["components", "Expression"]])],
    ["ParameterList", new Map([["parameters", "VariableDeclaration"]])],
    ["OverrideSpecifier", new Map([["overrides", "id"]])],
    ["Block", new Map([["statements", "Statement"]])],
    ["VariableDeclarationStatement", new Map([["assignments", "VariableDeclaration"]])],
    ["UsingForDirective", new Map([["functionList", "id"]])],
    ["FunctionCall", new Map([["fieldNames", "string"]])],
    ["PragmaDirective", new Map([["literals", "string"]])]
]);

/**
 * Given the name of some ASTNode class, and a reference to the parsed constructor
 * generate the necessary DataLog declarations and types for this class.
 */
function buildNodeDecls(name, constructor, baseName) {
    const rawParams = constructor.getParameters();
    let params = rawParams.map((p) => [p.getName(), p.isOptional(), p.getType().getText()]);

    assert(
        params.length >= 2 && params[0][0] === "id" && params[1][0] === "src",
        `First 2 params are id and src for ${name}`
    );

    const idBaseType = abstractASTNodeToIdType.get(baseName);

    assert(idBaseType !== undefined, `No base id type for base ${baseName}`);

    const res = [`.type ${name}Id <: ${idBaseType}`];

    for (let [paramName, optional, type] of params.slice(2)) {
        if (shouldSkipField(name, paramName)) {
            continue;
        }

        let datalogT;

        if (name === "ElementaryTypeName" && paramName === "stateMutability") {
            optional = false;
        }

        if (name === "UserDefinedTypeName" && paramName === "name") {
            optional = true;
        }

        if (optional) {
            assert(
                type.endsWith(" | undefined"),
                `Optional type should end with | undefined for ${type}`
            );
            type = type.slice(0, -12);
        }

        if (name === "ContractDefinition" && paramName === `scope`) {
            datalogT = "SourceUnitId";
        } else if (name === "VariableDeclaration" && paramName === `scope`) {
            datalogT = "id";
        } else if (name === "Literal" && paramName === `subdenomination`) {
            datalogT = "SubdenominationT";
        } else if (name === "ElementaryTypeNameExpression" && paramName === `typeName`) {
            // @note The TS type is string | ElementaryTypeName. We can't translate
            // this correctly as you can't do a union type of number | symbol in Souffle.
            // So for now just convert this to string.
            datalogT = "symbol";
        } else if (name === "ElementaryTypeName" && paramName === `stateMutability`) {
            datalogT = "ElementaryTypeNameMutability";
        } else if (name === "UserDefinedTypeName" && paramName === `name`) {
            datalogT = "symbol";
        } else if (name === "ForStatement" && paramName === `initializationExpression`) {
            datalogT = "ExpressionId";
        } else if (name === "VariableDeclarationStatement" && paramName === `assignments`) {
            // @todo remove
            datalogT = "VariableDeclarationIdList";
        } else if (name === "InheritanceSpecifier" && paramName === `baseType`) {
            datalogT = "id";
        } else if (name === "UsingForDirective" && paramName === `libraryName`) {
            datalogT = "id";
        } else if (name === "UsingForDirective" && paramName === `functionList`) {
            datalogT = "IdentifierPathIdList";
        } else if (name === "ModifierInvocation" && paramName === `modifierName`) {
            datalogT = "id";
        } else if (name === "ImportDirective" && paramName === `scope`) {
            datalogT = "SourceUnitId";
        } else if (name === "ImportDirective" && paramName === `sourceUnit`) {
            datalogT = "SourceUnitId";
        } else if (paramName === `referencedDeclaration` || paramName === `scope`) {
            datalogT = "id";
        } else if (
            (name === "BinaryOperation" || name === "UnaryOperation") &&
            paramName === `userFunction`
        ) {
            datalogT = "id";
        } else {
            datalogT = translateType(type);
        }

        if (optional) {
            res.push(`.decl ${name}_${paramName}(id: ${name}Id, val: ${datalogT}, present: bool)`);
        } else {
            res.push(`.decl ${name}_${paramName}(id: ${name}Id, val: ${datalogT})`);
        }
    }

    if (idBaseType !== "id") {
        res.push(`${idBaseType.slice(0, -2)}(id) :- ${name}(id).`);
    }

    // Note that this is a node type
    res.push(`Node(id) :- ${name}(id).`);
    // Add the decl itself
    res.push(`.decl ${name}(id: ${name}Id)`);

    return res;
}

function buildNodeDeclarations(classDescs) {
    const res = [];

    for (const [name, classDecl, constructor] of classDescs) {
        const bases = classDecl.getHeritage().filter((n) => astClassNames.has(n.getName()));

        if (bases.length !== 1) {
            throw new Error(`Not a single base for ${name}`);
        }

        res.push(...buildNodeDecls(name, constructor, bases[0].getName()));
    }

    return res;
}

function getDefaultValue(name, paramName, type) {
    if (astClassNames.has(type)) {
        return "-1";
    }

    if (type === "TimeUnit | EtherUnit" || type === "EtherUnit | TimeUnit") {
        return '""';
    }

    if (type === "string" || type === "ModifierInvocationKind") {
        return `""`;
    }

    if (type.endsWith("[]")) {
        return `new Literal("nil")`;
    }

    if (
        type === `ExpressionStatement | VariableDeclarationStatement` ||
        type === `UserDefinedTypeName | IdentifierPath` ||
        type === `IdentifierPath | UserDefinedTypeName`
    ) {
        return `-1`;
    }

    if ((name === "BinaryOperation" || name === "UnaryOperation") && paramName === "userFunction") {
        return -1;
    }

    throw new Error(`NYI getDefaultValue(${name}, ${paramName}, ${type})`);
}

const unchagedArgTypes = new Set([
    "boolean",
    "number",
    "FunctionCallKind",
    "ContractKind",
    "DataLocation",
    "StateVariableVisibility",
    "Mutability",
    "FunctionKind",
    "FunctionVisibility",
    "FunctionStateMutability",
    "LiteralKind",
    "ModifierInvocationKind",
    "TimeUnit | EtherUnit",
    "EtherUnit | TimeUnit",
    `"nonpayable" | "payable"`,
    `"payable" | "nonpayable"`,
    `ModifierInvocationKind`
]);

const paramRenameMap = new Map([
    [
        "VariableDeclaration",
        new Map([
            ["typeName", "vType"],
            ["overrideSpecifier", "vOverrideSpecifier"],
            ["value", "vValue"]
        ])
    ],
    [
        "VariableDeclaration",
        new Map([
            ["typeName", "vType"],
            ["overrideSpecifier", "vOverrideSpecifier"],
            ["value", "vValue"]
        ])
    ],
    [
        "FunctionDefinition",
        new Map([
            ["parameters", "vParameters"],
            ["returnParameters", "vReturnParameters"],
            ["modifiers", "vModifiers"],
            ["overrideSpecifier", "vOverrideSpecifier"],
            ["body", "vBody"]
        ])
    ],
    ["ExpressionStatement", new Map([["expression", "vExpression"]])],
    [
        "Assignment",
        new Map([
            ["leftHandSide", "vLeftHandSide"],
            ["rightHandSide", "vRightHandSide"]
        ])
    ],
    [
        "BinaryOperation",
        new Map([
            ["leftExpression", "vLeftExpression"],
            ["rightExpression", "vRightExpression"]
        ])
    ],
    [
        "FunctionCall",
        new Map([
            ["expression", "vExpression"],
            ["args", "vArguments"]
        ])
    ],
    [
        "Conditional",
        new Map([
            ["condition", "vCondition"],
            ["trueExpression", "vTrueExpression"],
            ["falseExpression", "vFalseExpression"]
        ])
    ],
    [
        "FunctionCallOptions",
        new Map([
            ["expression", "vExpression"],
            ["options", "vOptionsMap"]
        ])
    ],
    ["UnaryOperation", new Map([["subExpression", "vSubExpression"]])],
    [
        "IndexAccess",
        new Map([
            ["baseExpression", "vBaseExpression"],
            ["indexExpression", "vIndexExpression"]
        ])
    ],
    ["MemberAccess", new Map([["expression", "vExpression"]])],
    [
        "IndexRangeAccess",
        new Map([
            ["baseExpression", "vBaseExpression"],
            ["startExpression", "vStartExpression"],
            ["endExpression", "vEndExpression"]
        ])
    ],
    ["ErrorDefinition", new Map([["parameters", "vParameters"]])],
    ["EnumDefinition", new Map([["members", "vMembers"]])],
    ["EventDefinition", new Map([["parameters", "vParameters"]])],
    ["NewExpression", new Map([["typeName", "vTypeName"]])],
    ["StructDefinition", new Map([["members", "vMembers"]])],
    [
        "ModifierDefinition",
        new Map([
            ["parameters", "vParameters"],
            ["overrideSpecifier", "vOverrideSpecifier"],
            ["body", "vBody"]
        ])
    ],
    [
        "Mapping",
        new Map([
            ["keyType", "vKeyType"],
            ["valueType", "vValueType"]
        ])
    ],
    [
        "FunctionTypeName",
        new Map([
            ["parameterTypes", "vParameterTypes"],
            ["returnParameterTypes", "vReturnParameterTypes"]
        ])
    ],
    [
        "ArrayTypeName",
        new Map([
            ["baseType", "vBaseType"],
            ["length", "vLength"]
        ])
    ],
    [
        "ForStatement",
        new Map([
            ["body", "vBody"],
            ["initializationExpression", "vInitializationExpression"],
            ["condition", "vCondition"],
            ["loopExpression", "vLoopExpression"]
        ])
    ],
    [
        "TryStatement",
        new Map([
            ["externalCall", "vExternalCall"],
            ["clauses", "vClauses"]
        ])
    ],
    ["EmitStatement", new Map([["eventCall", "vEventCall"]])],
    ["Block", new Map([["statements", "vStatements"]])],
    ["UncheckedBlock", new Map([["statements", "vStatements"]])],
    ["Return", new Map([["expression", "vExpression"]])],
    [
        "WhileStatement",
        new Map([
            ["condition", "vCondition"],
            ["body", "vBody"]
        ])
    ],
    [
        "VariableDeclarationStatement",
        new Map([
            ["declarations", "vDeclarations"],
            ["initialValue", "vInitialValue"]
        ])
    ],
    [
        "IfStatement",
        new Map([
            ["condition", "vCondition"],
            ["trueBody", "vTrueBody"],
            ["falseBody", "vFalseBody"]
        ])
    ],
    [
        "TryCatchClause",
        new Map([
            ["block", "vBlock"],
            ["parameters", "vParameters"]
        ])
    ],
    [
        "DoWhileStatement",
        new Map([
            ["condition", "vCondition"],
            ["body", "vBody"]
        ])
    ],
    ["ParameterList", new Map([["parameters", "vParameters"]])],
    [
        "InheritanceSpecifier",
        new Map([
            ["baseType", "vBaseType"],
            ["args", "vArguments"]
        ])
    ],
    [
        "UsingForDirective",
        new Map([
            ["libraryName", "vLibraryName"],
            ["functionList", "vFunctionList"],
            ["typeName", "vTypeName"]
        ])
    ],
    [
        "ModifierInvocation",
        new Map([
            ["modifierName", "vModifierName"],
            ["args", "vArguments"]
        ])
    ],
    ["OverrideSpecifier", new Map([["overrides", "vOverrides"]])]
]);

function getCanonicalParamName(className, paramName) {
    if (paramRenameMap.has(className) && paramRenameMap.get(className).has(paramName)) {
        return paramRenameMap.get(className).get(paramName);
    }

    return paramName;
}

function translateFactArg(name, paramName, type) {
    let ref = `nd.${paramName}`;

    // Some hacks around a bugs in solc-typed-ast v. 17.0.2
    if (paramName === "referencedDeclaration") {
        return `${ref} === undefined ? -1 : ${ref}`;
    }

    if (paramName === "typeString") {
        return `sanitizeString(${ref})`;
    }

    if (name === `Literal` && paramName === `value`) {
        return `nd.value === null ? "" : sanitizeString(${ref})`;
    }

    if (name === `Literal` && paramName === `hexValue`) {
        return `nd.hexValue === null ? "" : sanitizeString(${ref})`;
    }

    if (type === "string") {
        return `sanitizeString(${ref})`;
    }

    if (unchagedArgTypes.has(type)) {
        return ref;
    }

    if (astClassNames.has(type)) {
        return ref;
    }

    if (
        type === `ExpressionStatement | VariableDeclarationStatement` ||
        type === `UserDefinedTypeName | IdentifierPath` ||
        type === `IdentifierPath | UserDefinedTypeName` ||
        type === `IdentifierPath | Identifier`
    ) {
        return ref;
    }

    if (name === `ElementaryTypeNameExpression` && paramName === `typeName`) {
        return `${ref} instanceof sol.ElementaryTypeName ? ${ref}.name : ${ref}`;
    }

    throw new Error(`Can't translate ${name}.${paramName} of type ${type}`);
}

function isTsTKnownArray(name, paramName, tsT) {
    if (tsT.endsWith("[]")) {
        const baseName = tsT.slice(0, -2);

        if (astClassNames.has(baseName)) {
            return true;
        }
    }

    const m = tsT.match(iterableRE);

    if (m !== null && astClassNames.has(m[1])) {
        return true;
    }

    const fieldM = arrayFieldsToBaseTypesM.get(name);

    if (fieldM) {
        return fieldM.get(paramName) !== undefined;
    }

    return false;
}

function buildFactInvocation(className, constructor, baseName) {
    const rawParams = constructor.getParameters();
    const params = rawParams.map((p) => [p.getName(), p.isOptional(), p.getType().getText()]);

    assert(
        params.length >= 2 && params[0][0] === "id" && params[1][0] === "src",
        `First 2 params are id and src for ${className}`
    );

    // Add anchor and src relations
    let res = `
        res.push(\`${className}(\${nd.id}).\`);
        res.push(\`src(\${nd.id}, "\${nd.src}").\`);
`;

    // Add relations for map arguments
    for (let [paramName, optional] of params.slice(2)) {
        const args = [`\${nd.id}`];

        if (className === "SourceUnit" && paramName === "exportedSymbols") {
            args.push("${'\"' + k + '\"'}", `\${v}`);
        } else if (className === "FunctionCallOptions" && paramName === `options`) {
            args.push("${'\"' + k + '\"'}", `\${v.id}`);
        } else {
            continue;
        }

        assert(!optional, `Unexpected optional map param ${className}.${paramName}`);

        const canonicalParamName = getCanonicalParamName(className, paramName);

        res += `
    for (let [k, v] of nd.${canonicalParamName}.entries()) {
        res.push(\`${className}_${paramName}(${args.join(", ")}).\`);
    }
`;
    }
    // Add relations for sparse array arguments
    for (let [paramName, ,] of params.slice(2)) {
        const canonicalParamName = getCanonicalParamName(className, paramName);
        if (
            !(
                (className === "TupleExpression" && canonicalParamName === "components") ||
                (className === "VariableDeclarationStatement" &&
                    canonicalParamName === "assignments")
            )
        ) {
            continue;
        }

        res += `
    for (let realI = 0, i = 0; realI < nd.${canonicalParamName}.length; realI++) {
        let t = nd.${canonicalParamName}[realI];

        if (t === null || t === undefined) {
            continue;
        }

        res.push(\`${className}_${paramName}(\${nd.id}, \${t}, \${i}, \${realI}).\`);
        i++;
    }
`;
    }

    // Add relations for array arguments
    for (let [paramName, optional, type] of params.slice(2)) {
        if (!isTsTKnownArray(className, paramName, type)) {
            continue;
        }

        if (skipFields.includes(paramName)) {
            continue;
        }

        const canonicalParamName = getCanonicalParamName(className, paramName);

        // Skip sparse arrays. We need special logic for them
        if (
            (className === "TupleExpression" && canonicalParamName === "components") ||
            (className === "VariableDeclarationStatement" && canonicalParamName === "assignments")
        ) {
            continue;
        }

        const args = [`\${nd.id}`];

        if (type === `number[]`) {
            args.push(`\${t}`);
        } else if (type === `string[]`) {
            args.push(`\${'"' + t + '"'}`);
        } else if (
            (className === "TupleExpression" && canonicalParamName === "components") ||
            (className === "VariableDeclarationStatement" && canonicalParamName === "assignments")
        ) {
            args.push(`\${t === null ? -1 : t}`);
        } else if (className === "UsingForDirective" && canonicalParamName === "vFunctionList") {
            args.push(`\${t instanceof sol.ASTNode ? t.id : t.definition.id}`);
            args.push(`\${t instanceof sol.ASTNode ? '""' : \`"\${t.operator}"\`}`);
        } else if (className === "FunctionCall" && canonicalParamName === "fieldNames") {
            args.push(`\${'"' + t + '"'}`);
        } else {
            args.push(`\${t.id}`);
        }

        args.push(`\${i}`);

        if (
            (className === "FunctionCall" ||
                className === "ModifierInvocation" ||
                className === "InheritanceSpecifier") &&
            paramName === "args"
        ) {
            paramName = "arguments";
        }

        let expr = `
    for (let i = 0; i < nd.${canonicalParamName}.length; i++) {
        let t = nd.${canonicalParamName}[i];
        res.push(\`${className}_${paramName}(${args.join(", ")}).\`);
    }
`;
        if (optional) {
            expr = `if (nd.${canonicalParamName} !== undefined) {
                ${expr}
            }`;
        }

        res += expr;
    }

    // Add relations for normal arguments
    for (let [paramName, optional, type] of params.slice(2)) {
        if (shouldSkipField(className, paramName)) {
            continue;
        }

        if (className === "ElementaryTypeName" && paramName === "stateMutability") {
            optional = false;
        }

        if (className === "UserDefinedTypeName" && paramName === "name") {
            optional = true;
        }

        const canonicalParamName = getCanonicalParamName(className, paramName);

        if (optional) {
            assert(
                type.endsWith(" | undefined"),
                `Optional type should end with | undefined for ${type}`
            );
            type = type.slice(0, -12);
        }

        let dynamicArg = translateFactArg(className, canonicalParamName, type);

        if (optional) {
            dynamicArg = `nd.${canonicalParamName} === undefined ? ${getDefaultValue(
                className,
                canonicalParamName,
                type
            )} : ${dynamicArg}`;
        }

        if (optional) {
            res += `res.push(\`${className}_${paramName}(\${nd.id}, \${translateVal(${dynamicArg})}, \${translateVal(nd.${canonicalParamName} !== undefined)}).\`);`;
        } else {
            res += `res.push(\`${className}_${paramName}(\${nd.id}, \${translateVal(${dynamicArg})}).\`);`;
        }
    }

    if (className === "FunctionCall") {
        res += `if (infer.isFunctionCallExternal(nd)) {
            res.push(\`externalCall(\${nd.id}).\`);
        }
`;
    }

    if (baseName === "Expression" || baseName === "PrimaryExpression") {
        res += `if (sol.isConstant(nd)) {
            res.push(\`ConstantExpression(\${nd.id}).\`);
        }
`;
    }

    if (className === "FunctionDefinition") {
        res += `
            res.push(\`FunctionDefinition_signature(\${nd.id}, "\${infer.signature(nd)}").\`);
            res.push(\`FunctionDefinition_signatureHash(\${nd.id}, "\${infer.signatureHash(nd)}").\`);
`;
    }

    if (className === "VariableDeclaration") {
        res += `if (nd.stateVariable && nd.visibility === sol.StateVariableVisibility.Public) {
            res.push(\`VariableDeclaration_signature(\${nd.id}, "\${infer.signature(nd)}").\`);
            res.push(\`VariableDeclaration_signatureHash(\${nd.id}, "\${infer.signatureHash(nd)}").\`);
        }
`;
    }

    return res;
}

function buildFactBuilderFun(classDescs) {
    let body = "";

    for (let i = 0; i < classDescs.length; i++) {
        const [name, classDecl, constructor] = classDescs[i];
        const bases = classDecl.getHeritage().filter((n) => astClassNames.has(n.getName()));

        const ifBody = buildFactInvocation(name, constructor, bases[0].getName());

        if (body !== "") {
            body += " else ";
        }

        body += `if (nd instanceof sol.${name}) {
    ${ifBody}
}`;
    }

    body += ` else {\n    throw new Error(\`Unknown AST node type \${nd.constructor.name}.\`);\n}`;

    return `
export function translateASTNodeInternal(nd: sol.ASTNode, infer: sol.InferType): string[] {
    let res: string[] = [];
    ${body}
    return res;
}
`;
}

async function main() {
    const parser = await import("@ts-ast-parser/core");

    let res = [staticPreamble];

    const { project } = await parser.parseFromFiles(astFiles);

    modules = project?.getModules() ?? [];

    console.log(`Collected ${modules.length} AST TS files from solc-typed-ast`);

    const classes = [];

    for (const module of modules) {
        const decls = module.getDeclarations();
        let classDecls = decls.filter((d) => d.getKind() == "Class");

        if (module.getSourcePath().endsWith("/statement.ts")) {
            assert(classDecls.length === 2, `statement.ts has 2 classes`);

            classDecls = [classDecls[0]];
        }

        assert(classDecls.length === 1, `Not a single decl for ${module.getSourcePath()}`);
        const classDecl = classDecls[0];

        const name = classDecl.getName();

        astClassNames.add(name);

        // Skip emitting declarations for "abstract" nodes.
        // Id types for those are written in the staticPreamble
        if (abstractClassNames.has(name)) {
            continue;
        }

        const constructors = classDecl.getConstructors();

        assert(constructors.length === 1, `Not a single constructor for ${name}`);

        const constructor = constructors[0];

        classes.push([name, classDecl, constructor]);
    }

    console.log(`Collected ${classes.length} AST classes from solc-typed-ast`);

    const genPath = "src/gen/declarations.ts";
    console.log(`Generating ${genPath}`);
    res.push(...buildNodeDeclarations(classes));
    const declsContents = `export const preamble = \`${res.join("\n")}\`;\n`;
    fse.writeFileSync(genPath, declsContents, { encoding: "utf-8" });

    const translatePath = "src/gen/translate.ts";
    console.log(`Generating ${translatePath}`);
    const factBuilderFun = buildFactBuilderFun(classes);
    const translateContents = `
import * as sol from "solc-typed-ast";
import { sanitizeString, translateVal } from "../lib/utils";

${factBuilderFun}
`;
    fse.writeFileSync(translatePath, translateContents, { encoding: "utf-8" });
}

main();
