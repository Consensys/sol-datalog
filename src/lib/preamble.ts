const typeDecls = `
.type id <: number

// We separate the ids in several sub-types
// as a syntactic hint to people writing rules
// using ids (i.e. recognizing what kind of id is expected in different relations)
.type SourceUnitId <: id
.type ExpressionId <: id
.type StatementId <: id
.type VarDeclId <: id

.type VarList = [
    head : VarDeclId,
    tail : List
]

.type StmtList = [
    head : StatementId,
    tail : List
]

.type ExprList = [
    head : ExpressionId,
    tail : List
]
`;

const ruleDecls = `
// @todo Missing exportedSymbols
.decl SourceUnit(
    id: SourceUnitId,
    src: symbol,
    sourceEntryKey: symbol,
    sourceListIndex: number,
    absolutePath: string)

.decl ContractDefinition(id: id, name: symbol)
.decl VariableDeclaration(id: id, name: symbol)
.decl ParameterList(id: id, variables: VarList)
.decl FunctionDefinition(id: id, name: symbol, arguments: id, returns: id, body: id)
.decl Block(id: id, smts: StmtList)

.decl parent(parentId: id, childId: id)
.decl ancestor(parentId: id, childId: id)

// Statements
.decl ExpressionStatement(id: id, stmt: id) 

// Expressions
.decl Assignment(id: id, lhs: id, rhs: id)
.decl BinaryOperation(id: id, left: id, right: id, op: symbol)
.decl Identifier(id: id, name: symbol, referencedId: id)
`;

const helperRelations = `
ancestor(x, y) :- parent(x, y);
ancestor(x, y) :- parent(x, z), ancestor(z, y);
`;

export const preamble = [typeDecls, ruleDecls, helperRelations].join(`\n`);
