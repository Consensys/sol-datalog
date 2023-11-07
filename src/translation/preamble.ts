export const preamble = `

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

.type SourceUnitId <: id
.decl SourceUnit(id: SourceUnitId, src: symbol, sourceEntryKey: symbol, sourceListIndex: number, absolutePath: symbol, exportedSymbols: ExportedSymbolsList, license: symbol, haslicense: bool)
.type ContractDefinitionId <: id
.decl ContractDefinition(id: ContractDefinitionId, src: symbol, name: symbol, scope: SourceUnitId, kind: ContractKind, abstract: bool, fullyImplemented: bool, linearizedBaseContracts: ContractDefinitionIdList, usedErrors: ErrorDefinitionIdList, usedEvents: EventDefinitionIdList)
.type VariableDeclarationId <: id
.decl VariableDeclaration(id: VariableDeclarationId, src: symbol, constant: bool, indexed: bool, name: symbol, scope: id, stateVariable: bool, storageLocation: DataLocation, visibility: StateVariableVisibility, mutability: Mutability, typeString: symbol, typeName: TypeNameId, hastypeName: bool, overrideSpecifier: OverrideSpecifierId, hasoverrideSpecifier: bool, value: ExpressionId, hasvalue: bool)
.type FunctionDefinitionId <: id
.decl FunctionDefinition(id: FunctionDefinitionId, src: symbol, scope: number, kind: FunctionKind, name: symbol, virtual: bool, visibility: FunctionVisibility, stateMutability: FunctionStateMutability, isConstructor: bool, parameters: ParameterListId, returnParameters: ParameterListId, modifiers: ModifierInvocationIdList, overrideSpecifier: OverrideSpecifierId, hasoverrideSpecifier: bool, body: BlockId, hasbody: bool)
.type ExpressionStatementId <: StatementId
.decl ExpressionStatement(id: ExpressionStatementId, src: symbol, expression: ExpressionId)
.type AssignmentId <: ExpressionId
.decl Assignment(id: AssignmentId, src: symbol, typeString: symbol, operator: symbol, leftHandSide: ExpressionId, rightHandSide: ExpressionId)
.type BinaryOperationId <: ExpressionId
.decl BinaryOperation(id: BinaryOperationId, src: symbol, typeString: symbol, operator: symbol, leftExpression: ExpressionId, rightExpression: ExpressionId, userFunction: number, hasuserFunction: bool)
.type IdentifierId <: ExpressionId
.decl Identifier(id: IdentifierId, src: symbol, typeString: symbol, name: symbol, referencedDeclaration: number)
.type FunctionCallId <: ExpressionId
.decl FunctionCall(id: FunctionCallId, src: symbol, typeString: symbol, kind: FunctionCallKind, expression: ExpressionId, args: ExpressionIdList, fieldNames: StringList, hasfieldNames: bool)
.type LiteralId <: ExpressionId
.decl Literal(id: LiteralId, src: symbol, typeString: symbol, kind: LiteralKind, hexValue: symbol, value: symbol, subdenomination: SubdenominationT, hassubdenomination: bool)
.type NewExpressionId <: ExpressionId
.decl NewExpression(id: NewExpressionId, src: symbol, typeString: symbol, typeName: TypeNameId)
.type ConditionalId <: ExpressionId
.decl Conditional(id: ConditionalId, src: symbol, typeString: symbol, condition: ExpressionId, trueExpression: ExpressionId, falseExpression: ExpressionId)
.type FunctionCallOptionsId <: ExpressionId
.decl FunctionCallOptions(id: FunctionCallOptionsId, src: symbol, typeString: symbol, expression: ExpressionId, options: NamedExpressionIdList)
.type UnaryOperationId <: ExpressionId
.decl UnaryOperation(id: UnaryOperationId, src: symbol, typeString: symbol, prefix: bool, operator: symbol, subExpression: ExpressionId, userFunction: number, hasuserFunction: bool)
.type IndexAccessId <: ExpressionId
.decl IndexAccess(id: IndexAccessId, src: symbol, typeString: symbol, baseExpression: ExpressionId, indexExpression: ExpressionId, hasindexExpression: bool)
.type MemberAccessId <: ExpressionId
.decl MemberAccess(id: MemberAccessId, src: symbol, typeString: symbol, expression: ExpressionId, memberName: symbol, referencedDeclaration: number)
.type ElementaryTypeNameExpressionId <: ExpressionId
.decl ElementaryTypeNameExpression(id: ElementaryTypeNameExpressionId, src: symbol, typeString: symbol, typeName: symbol)
.type TupleExpressionId <: ExpressionId
.decl TupleExpression(id: TupleExpressionId, src: symbol, typeString: symbol, isInlineArray: bool, components: ExpressionIdList)
.type IndexRangeAccessId <: ExpressionId
.decl IndexRangeAccess(id: IndexRangeAccessId, src: symbol, typeString: symbol, baseExpression: ExpressionId, startExpression: ExpressionId, hasstartExpression: bool, endExpression: ExpressionId, hasendExpression: bool)
.type ErrorDefinitionId <: id
.decl ErrorDefinition(id: ErrorDefinitionId, src: symbol, name: symbol, parameters: ParameterListId)
.type UserDefinedValueTypeDefinitionId <: id
.decl UserDefinedValueTypeDefinition(id: UserDefinedValueTypeDefinitionId, src: symbol, name: symbol, underlyingType: ElementaryTypeNameId)
.type StructDefinitionId <: id
.decl StructDefinition(id: StructDefinitionId, src: symbol, name: symbol, scope: number, visibility: symbol, members: VariableDeclarationIdList)
.type EnumDefinitionId <: id
.decl EnumDefinition(id: EnumDefinitionId, src: symbol, name: symbol, members: EnumValueIdList)
.type EnumValueId <: id
.decl EnumValue(id: EnumValueId, src: symbol, name: symbol)
.type EventDefinitionId <: id
.decl EventDefinition(id: EventDefinitionId, src: symbol, anonymous: bool, name: symbol, parameters: ParameterListId)
.type ModifierDefinitionId <: id
.decl ModifierDefinition(id: ModifierDefinitionId, src: symbol, name: symbol, virtual: bool, visibility: symbol, parameters: ParameterListId, overrideSpecifier: OverrideSpecifierId, hasoverrideSpecifier: bool, body: BlockId, hasbody: bool)
.type MappingId <: TypeNameId
.decl Mapping(id: MappingId, src: symbol, typeString: symbol, keyType: TypeNameId, valueType: TypeNameId)
.type FunctionTypeNameId <: TypeNameId
.decl FunctionTypeName(id: FunctionTypeNameId, src: symbol, typeString: symbol, visibility: FunctionVisibility, stateMutability: FunctionStateMutability, parameterTypes: ParameterListId, returnParameterTypes: ParameterListId)
.type ElementaryTypeNameId <: TypeNameId
.decl ElementaryTypeName(id: ElementaryTypeNameId, src: symbol, typeString: symbol, name: symbol, stateMutability: ElementaryTypeNameMutability)
.type ArrayTypeNameId <: TypeNameId
.decl ArrayTypeName(id: ArrayTypeNameId, src: symbol, typeString: symbol, baseType: TypeNameId, length: ExpressionId, haslength: bool)
.type UserDefinedTypeNameId <: TypeNameId
.decl UserDefinedTypeName(id: UserDefinedTypeNameId, src: symbol, typeString: symbol, name: symbol, referencedDeclaration: number)
.type ForStatementId <: StatementId
.decl ForStatement(id: ForStatementId, src: symbol, body: StatementId, initializationExpression: ExpressionId, hasinitializationExpression: bool, condition: ExpressionId, hascondition: bool, loopExpression: ExpressionStatementId, hasloopExpression: bool)
.type TryStatementId <: StatementId
.decl TryStatement(id: TryStatementId, src: symbol, externalCall: FunctionCallId, clauses: TryCatchClauseIdList)
.type ThrowId <: StatementId
.decl Throw(id: ThrowId, src: symbol)
.type BreakId <: StatementId
.decl Break(id: BreakId, src: symbol)
.type EmitStatementId <: StatementId
.decl EmitStatement(id: EmitStatementId, src: symbol, eventCall: FunctionCallId)
.type InlineAssemblyId <: StatementId
.decl InlineAssembly(id: InlineAssemblyId, src: symbol)
.type BlockId <: StatementId
.decl Block(id: BlockId, src: symbol, statements: StatementIdList)
.type RevertStatementId <: StatementId
.decl RevertStatement(id: RevertStatementId, src: symbol, errorCall: FunctionCallId)
.type UncheckedBlockId <: StatementId
.decl UncheckedBlock(id: UncheckedBlockId, src: symbol, statements: StatementIdList)
.type ReturnId <: StatementId
.decl Return(id: ReturnId, src: symbol, functionReturnParameters: number, expression: ExpressionId, hasexpression: bool)
.type WhileStatementId <: StatementId
.decl WhileStatement(id: WhileStatementId, src: symbol, condition: ExpressionId, body: StatementId)
.type VariableDeclarationStatementId <: StatementId
.decl VariableDeclarationStatement(id: VariableDeclarationStatementId, src: symbol, assignments: VariableDeclarationIdList, declarations: VariableDeclarationIdList, initialValue: ExpressionId, hasinitialValue: bool)
.type IfStatementId <: StatementId
.decl IfStatement(id: IfStatementId, src: symbol, condition: ExpressionId, trueBody: StatementId, falseBody: StatementId, hasfalseBody: bool)
.type TryCatchClauseId <: StatementId
.decl TryCatchClause(id: TryCatchClauseId, src: symbol, errorName: symbol, block: BlockId, parameters: ParameterListId, hasparameters: bool)
.type DoWhileStatementId <: StatementId
.decl DoWhileStatement(id: DoWhileStatementId, src: symbol, condition: ExpressionId, body: StatementId)
.type ContinueId <: StatementId
.decl Continue(id: ContinueId, src: symbol)
.type PlaceholderStatementId <: StatementId
.decl PlaceholderStatement(id: PlaceholderStatementId, src: symbol)
.type ParameterListId <: id
.decl ParameterList(id: ParameterListId, src: symbol, parameters: VariableDeclarationIdList)
.type InheritanceSpecifierId <: id
.decl InheritanceSpecifier(id: InheritanceSpecifierId, src: symbol, baseType: id, args: ExpressionIdList)
.type UsingForDirectiveId <: id
.decl UsingForDirective(id: UsingForDirectiveId, src: symbol, isGlobal: bool, libraryName: id, haslibraryName: bool, functionList: IdentifierPathIdList, hasfunctionList: bool, typeName: TypeNameId, hastypeName: bool)
.type IdentifierPathId <: id
.decl IdentifierPath(id: IdentifierPathId, src: symbol, name: symbol, referencedDeclaration: number)
.type PragmaDirectiveId <: id
.decl PragmaDirective(id: PragmaDirectiveId, src: symbol, literals: StringList)
.type ModifierInvocationId <: id
.decl ModifierInvocation(id: ModifierInvocationId, src: symbol, modifierName: id, args: ExpressionIdList, kind: ModifierInvocationKind, haskind: bool)
.type ImportDirectiveId <: id
.decl ImportDirective(id: ImportDirectiveId, src: symbol, file: symbol, absolutePath: symbol, unitAlias: symbol, scope: SourceUnitId, sourceUnit: SourceUnitId)
.type OverrideSpecifierId <: id
.decl OverrideSpecifier(id: OverrideSpecifierId, src: symbol, overrides: IdList)
.type StructuredDocumentationId <: id
.decl StructuredDocumentation(id: StructuredDocumentationId, src: symbol, text: symbol)
`;
