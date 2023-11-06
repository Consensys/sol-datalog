const { assert } = require("console");

const astFiles = [
    "../solc-typed-ast-clean/src/ast/implementation/meta/source_unit.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/contract_definition.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/variable_declaration.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/function_definition.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/expression_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/assignment.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/binary_operation.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/identifier.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/function_call.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/literal.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/new_expression.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/conditional.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/function_call_options.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/unary_operation.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/index_access.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/primary_expression.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/member_access.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/expression.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/elementary_type_name_expression.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/tuple_expression.ts",
    "../solc-typed-ast-clean/src/ast/implementation/expression/index_range_access.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/error_definition.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/user_defined_value_type_definition.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/struct_definition.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/enum_definition.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/enum_value.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/event_definition.ts",
    "../solc-typed-ast-clean/src/ast/implementation/declaration/modifier_definition.ts",
    "../solc-typed-ast-clean/src/ast/implementation/type/mapping.ts",
    "../solc-typed-ast-clean/src/ast/implementation/type/function_type_name.ts",
    "../solc-typed-ast-clean/src/ast/implementation/type/elementary_type_name.ts",
    "../solc-typed-ast-clean/src/ast/implementation/type/array_type_name.ts",
    "../solc-typed-ast-clean/src/ast/implementation/type/type_name.ts",
    "../solc-typed-ast-clean/src/ast/implementation/type/user_defined_type_name.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/for_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/try_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/throw.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/break.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/emit_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/inline_assembly.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/block.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/revert_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/unchecked_block.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/return.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/while_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/variable_declaration_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/if_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/try_catch_clause.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/do_while_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/continue.ts",
    "../solc-typed-ast-clean/src/ast/implementation/statement/placeholder_statement.ts",
    "../solc-typed-ast-clean/src/ast/implementation/meta/parameter_list.ts",
    "../solc-typed-ast-clean/src/ast/implementation/meta/inheritance_specifier.ts",
    "../solc-typed-ast-clean/src/ast/implementation/meta/using_for_directive.ts",
    "../solc-typed-ast-clean/src/ast/implementation/meta/identifier_path.ts",
    "../solc-typed-ast-clean/src/ast/implementation/meta/pragma_directive.ts",
    "../solc-typed-ast-clean/src/ast/implementation/meta/modifier_invocation.ts",
    "../solc-typed-ast-clean/src/ast/implementation/meta/import_directive.ts",
    "../solc-typed-ast-clean/src/ast/implementation/meta/override_specifier.ts",
    "../solc-typed-ast-clean/src/ast/implementation/meta/structured_documentation.ts"
];

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
    name: symbol,
    id: id,
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
        } else if (name === "UserDefinedTypeName" && paramName === `path`) {
            continue; // In the translation we merge path and name into simpliy name for now
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

(async () => {
    const parser = await import("@ts-ast-parser/core");

    let res = [staticPreamble];

    const { project } = await parser.parseFromFiles(astFiles);

    modules = project?.getModules() ?? [];

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
        classes.push(classDecl);
    }

    for (const classDecl of classes) {
        const constructors = classDecl.getConstructors();
        const name = classDecl.getName();

        // Skip emitting declarations for "abstract" nodes.
        // Id types for those are written in the staticPreamble
        if (abstractClassNames.has(name)) {
            continue;
        }

        assert(constructors.length === 1, `Not a single constructor for ${name}`);

        const constructor = constructors[0];

        const bases = classDecl.getHeritage().filter((n) => astClassNames.has(n.getName()));

        if (bases.length !== 1) {
            throw new Error(`Not a single base for ${name}`);
        }

        res.push(...buildNodeDecls(name, constructor, bases[0].getName()));
    }

    console.log("export const preamble = `", res.join("\n"), "`;");
})();
