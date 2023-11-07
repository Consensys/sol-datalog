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

.type SubdenominationT = TimeUnit | EtherUnit

.type StringList = [
    head : symbol,
    tail : StringList
]

.type ExportedSymbolsList = [
    id: id,
    name: symbol,
    tail : ExportedSymbolsList 
]

.type NamedExpressionIdList = [
    name: symbol,
    id: ExpressionId,
    tail : NamedExpressionIdList
]

.type ContractDefinitionIdList = [
    head : ContractDefinitionId,
    tail : ContractDefinitionIdList
]

.type VariableDeclarationIdList = [
    head : VariableDeclarationId,
    tail : VariableDeclarationIdList
]

.type EventDefinitionIdList = [
    head : EventDefinitionId,
    tail : EventDefinitionIdList
]

.type ErrorDefinitionIdList = [
    head : ErrorDefinitionId,
    tail : ErrorDefinitionIdList
]

.type IdentifierPathIdList = [
    head : IdentifierPathId,
    tail : IdentifierPathIdList
]

.type ExpressionIdList = [
    head : ExpressionId,
    tail : ExpressionIdList
]

.type StatementIdList = [
    head : StatementId,
    tail : StatementIdList
]

.type ModifierInvocationIdList = [
    head : ModifierInvocationId,
    tail : ModifierInvocationIdList
]

.type EnumValueIdList = [
    head : EnumValueId,
    tail : EnumValueIdList
]

.type TryCatchClauseIdList = [
    head : TryCatchClauseId,
    tail : TryCatchClauseIdList
]

.type IdList = [
    head : id, 
    tail : IdList
]

.decl parent(parentId: id, childId: id)
`;

const skipFields = ["raw", "documentation", "nameLocation", "children"];

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
    ["string[]", "StringList"],
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
    ["PrimaryExpression", "ExpressionId"], // @todo Do we want a separate PrimaryExpressionId?
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

    if (tsT.endsWith("[]")) {
        const baseName = tsT.slice(0, -2);

        if (astClassNames.has(baseName)) {
            return `${baseName}IdList`;
        }
    }

    const m = tsT.match(iterableRE);

    if (m !== null && astClassNames.has(m[1])) {
        return `${m[1]}IdList`;
    }

    throw new Error(`Can't translate type ${tsT}`);
}

/**
 * Given the name of some ASTNode class, and a reference to the parsed constructor
 * generate the neccessary DataLog declartaions and types for this class.
 */
function buildNodeDecls(name, constructor, baseName) {
    const rawParams = constructor.getParameters();
    const params = rawParams.map((p) => [p.getName(), p.isOptional(), p.getType().getText()]);

    assert(
        params.length >= 2 && params[0][0] === "id" && params[1][0] === "src",
        `First 2 params are id and src for ${name}`
    );

    const idBaseType = abstractASTNodeToIdType.get(baseName);

    assert(idBaseType !== undefined, `No base id type for base ${baseName}`);

    const res = [`.type ${name}Id <: ${idBaseType}`];

    let dynamicArgs = [];

    for (let [paramName, optional, type] of params.slice(2)) {
        if (skipFields.includes(paramName)) {
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

        if (name === "SourceUnit" && paramName === `exportedSymbols`) {
            datalogT = `ExportedSymbolsList`;
        } else if (name === "ContractDefinition" && paramName === `linearizedBaseContracts`) {
            datalogT = "ContractDefinitionIdList";
        } else if (name === "ContractDefinition" && paramName === `usedErrors`) {
            datalogT = "ErrorDefinitionIdList";
        } else if (name === "ContractDefinition" && paramName === `usedEvents`) {
            datalogT = "EventDefinitionIdList";
        } else if (name === "ContractDefinition" && paramName === `scope`) {
            datalogT = "SourceUnitId";
        } else if (name === "VariableDeclaration" && paramName === `scope`) {
            datalogT = "id";
        } else if (name === "Literal" && paramName === `subdenomination`) {
            datalogT = "SubdenominationT";
        } else if (name === "FunctionCallOptions" && paramName === `options`) {
            datalogT = "NamedExpressionIdList";
        } else if (name === "ElementaryTypeNameExpression" && paramName === `typeName`) {
            // @note The TS type is string | ElementaryTypeName. We can't translate
            // this correctly as you can't do a union type of number | symbol in Souffle.
            // So for now just convert this to string.
            datalogT = "symbol";
        } else if (name === "TupleExpression" && paramName === `components`) {
            datalogT = "ExpressionIdList";
        } else if (name === "ElementaryTypeName" && paramName === `stateMutability`) {
            datalogT = "ElementaryTypeNameMutability";
        } else if (name === "UserDefinedTypeName" && paramName === `name`) {
            datalogT = "symbol";
        } else if (name === "ForStatement" && paramName === `initializationExpression`) {
            datalogT = "ExpressionId";
        } else if (
            name === "InlineAssembly" &&
            (paramName === `externalReferences` ||
                paramName === `operations` ||
                paramName === `flags` ||
                paramName === `yul` ||
                paramName === `evmVersion`)
        ) {
            // @todo Add this InlineAssembly fields
            continue;
        } else if (name === "VariableDeclarationStatement" && paramName === `assignments`) {
            datalogT = "VariableDeclarationIdList";
        } else if (name === "InheritanceSpecifier" && paramName === `baseType`) {
            datalogT = "id";
        } else if (name === "UsingForDirective" && paramName === `libraryName`) {
            datalogT = "id";
        } else if (name === "UsingForDirective" && paramName === `functionList`) {
            datalogT = "IdentifierPathIdList";
        } else if (name === "ModifierInvocation" && paramName === `modifierName`) {
            datalogT = "id";
        } else if (name === "ImportDirective" && paramName === `symbolAliases`) {
            // @todo add vSymbolAliases instead of symbolAliases
            continue;
        } else if (name === "ImportDirective" && paramName === `scope`) {
            datalogT = "SourceUnitId";
        } else if (name === "ImportDirective" && paramName === `sourceUnit`) {
            datalogT = "SourceUnitId";
        } else if (name === "OverrideSpecifier" && paramName === `overrides`) {
            datalogT = "IdList";
        } else {
            datalogT = translateType(type);
        }

        dynamicArgs.push(`${paramName}: ${datalogT}`);

        if (optional) {
            dynamicArgs.push(`has${paramName}: bool`);
        }
    }

    res.push(
        `.decl ${name}(id: ${name}Id, src: symbol${
            dynamicArgs.length > 0 ? ", " + dynamicArgs.join(", ") : ""
        })`
    );

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

    if (type === "TimeUnit | EtherUnit") {
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
        type === `UserDefinedTypeName | IdentifierPath`
    ) {
        return `-1`;
    }

    throw new Error(`NYI getDefaultValue(${name}, ${paramName}, ${type})`);
}

const unchagedArgTypes = new Set([
    "string[]",
    "boolean",
    "number",
    "string",
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
    `"nonpayable" | "payable"`,
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

function translateFactArg(name, paramName, type) {
    let ref = `nd.${paramName}`;

    // Some hacks around a bugs in solc-typed-ast v. 17.0.2
    if (paramName === "referencedDeclaration") {
        return `${ref} === undefined ? -1 : ${ref}`;
    }

    if (paramName === "typeString") {
        ref = `escapeDoubleQuotes(handleMissingString(${ref}))`;
    }

    // hex string literals may decode weirdly to strings resulting in un-terminated quotes.
    // To guard against this don't emit value if this is kind is hexString
    if (name === `Literal` && paramName === `value`) {
        // In at least one case in `test/samples/solidity/writer_edge_cases.sourced.sol` value can be null
        ref = `handleMissingString(${ref})`;
        ref = `nd.kind === sol.LiteralKind.HexString ? "" : ${ref}`;
    }

    if (unchagedArgTypes.has(type)) {
        return ref;
    }

    if (astClassNames.has(type)) {
        return ref;
    }

    if (type.endsWith("[]")) {
        const baseName = type.slice(0, -2);

        if (astClassNames.has(baseName)) {
            return ref;
        }
    }

    const m = type.match(iterableRE);

    if (m !== null && astClassNames.has(m[1])) {
        return ref;
    }

    if (type === `Map<string, number>`) {
        return `new Literal(translateSymbolsMap(${ref}))`;
    }

    if (type === `Map<string, Expression>`) {
        return `new Literal(translateExpressionsMap(${ref}))`;
    }

    if (
        type === `ExpressionStatement | VariableDeclarationStatement` ||
        type === `UserDefinedTypeName | IdentifierPath` ||
        type === `IdentifierPath | Identifier`
    ) {
        return ref;
    }

    if (type === `Iterable<UserDefinedTypeName | IdentifierPath>`) {
        return ref;
    }

    if (
        name === "ContractDefinition" &&
        (paramName === "linearizedBaseContracts" || paramName === "usedErrors")
    ) {
        return ref;
    }

    if (name === `ElementaryTypeNameExpression` && paramName === `typeName`) {
        return `${ref} instanceof sol.ElementaryTypeName ? ${ref}.name : ${ref}`;
    }

    if (name === `TupleExpression` && paramName === `components`) {
        return `nd.vOriginalComponents.map((c) => c === null ? -1 : c.id)`;
    }

    if (name === "VariableDeclarationStatement" && paramName === `assignments`) {
        return `nd.assignments.map((c) => c === null ? -1 : c)`;
    }

    throw new Error(`Can't translate ${name}.${paramName} of type ${type}`);
}

function buildFactInvocation(name, constructor) {
    const rawParams = constructor.getParameters();
    const params = rawParams.map((p) => [p.getName(), p.isOptional(), p.getType().getText()]);

    assert(
        params.length >= 2 && params[0][0] === "id" && params[1][0] === "src",
        `First 2 params are id and src for ${name}`
    );

    let res = ``;

    let dynamicArgs = ["nd.id", "nd.src"];

    for (let [paramName, optional, type] of params.slice(2)) {
        if (skipFields.includes(paramName)) {
            continue;
        }

        if (
            name === "InlineAssembly" &&
            (paramName === `externalReferences` ||
                paramName === `operations` ||
                paramName === `flags` ||
                paramName === `yul` ||
                paramName === `evmVersion`)
        ) {
            // @todo Add this InlineAssembly fields
            continue;
        }

        if (name === "ImportDirective" && paramName === `symbolAliases`) {
            // @todo add vSymbolAliases instead of symbolAliases
            continue;
        }

        if (name === "ElementaryTypeName" && paramName === "stateMutability") {
            optional = false;
        }

        if (name === "UserDefinedTypeName" && paramName === "name") {
            optional = true;
        }

        if (paramRenameMap.has(name) && paramRenameMap.get(name).has(paramName)) {
            paramName = paramRenameMap.get(name).get(paramName);
        }

        if (optional) {
            assert(
                type.endsWith(" | undefined"),
                `Optional type should end with | undefined for ${type}`
            );
            type = type.slice(0, -12);
        }

        let dynamicArg = translateFactArg(name, paramName, type);

        if (optional) {
            dynamicArg = `nd.${paramName} === undefined ? ${getDefaultValue(
                name,
                paramName,
                type
            )} : ${dynamicArg}`;
        }

        dynamicArgs.push(dynamicArg);

        if (optional) {
            dynamicArgs.push(`nd.${paramName} === undefined`);
        }
    }

    res += `args = translateVals(${dynamicArgs.join(", ")});`;

    return res;
}

function buildFactBuilderFun(classDescs) {
    let body = "";

    for (let i = 0; i < classDescs.length; i++) {
        const [name, , constructor] = classDescs[i];

        const ifBody = buildFactInvocation(name, constructor);

        if (body !== "") {
            body += " else ";
        }

        body += `if (nd instanceof sol.${name}) {
    ${ifBody}
}`;
    }

    body += ` else {\n    throw new Error(\`Unknown AST node type \${nd.constructor.name}.\`);\n}`;

    return `
export function translateASTNodeInternal(nd: sol.ASTNode): string {
    let args: string[];
    ${body}
    return \`\${nd.constructor.name}(\${args.join(", ")}).\`;
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
import { Literal, translateSymbolsMap, translateExpressionsMap, translateVals, escapeDoubleQuotes, handleMissingString } from "../lib/utils";

${factBuilderFun}
`;
    fse.writeFileSync(translatePath, translateContents, { encoding: "utf-8" });
}

main();
