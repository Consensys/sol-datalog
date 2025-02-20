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

.type SourceUnitId <: id
.decl SourceUnit_sourceEntryKey(id: SourceUnitId, val: symbol)
.decl SourceUnit_sourceListIndex(id: SourceUnitId, val: number)
.decl SourceUnit_absolutePath(id: SourceUnitId, val: symbol)
.decl SourceUnit_license(id: SourceUnitId, val: symbol, present: bool)
Node(id) :- SourceUnit(id).
.decl SourceUnit(id: SourceUnitId)
.type ContractDefinitionId <: id
.decl ContractDefinition_name(id: ContractDefinitionId, val: symbol)
.decl ContractDefinition_scope(id: ContractDefinitionId, val: SourceUnitId)
.decl ContractDefinition_kind(id: ContractDefinitionId, val: ContractKind)
.decl ContractDefinition_abstract(id: ContractDefinitionId, val: bool)
.decl ContractDefinition_fullyImplemented(id: ContractDefinitionId, val: bool)
Node(id) :- ContractDefinition(id).
.decl ContractDefinition(id: ContractDefinitionId)
.type VariableDeclarationId <: id
.decl VariableDeclaration_constant(id: VariableDeclarationId, val: bool)
.decl VariableDeclaration_indexed(id: VariableDeclarationId, val: bool)
.decl VariableDeclaration_name(id: VariableDeclarationId, val: symbol)
.decl VariableDeclaration_scope(id: VariableDeclarationId, val: id)
.decl VariableDeclaration_stateVariable(id: VariableDeclarationId, val: bool)
.decl VariableDeclaration_storageLocation(id: VariableDeclarationId, val: DataLocation)
.decl VariableDeclaration_visibility(id: VariableDeclarationId, val: StateVariableVisibility)
.decl VariableDeclaration_mutability(id: VariableDeclarationId, val: Mutability)
.decl VariableDeclaration_typeString(id: VariableDeclarationId, val: symbol)
.decl VariableDeclaration_typeName(id: VariableDeclarationId, val: TypeNameId, present: bool)
.decl VariableDeclaration_overrideSpecifier(id: VariableDeclarationId, val: OverrideSpecifierId, present: bool)
.decl VariableDeclaration_value(id: VariableDeclarationId, val: ExpressionId, present: bool)
Node(id) :- VariableDeclaration(id).
.decl VariableDeclaration(id: VariableDeclarationId)
.type FunctionDefinitionId <: id
.decl FunctionDefinition_scope(id: FunctionDefinitionId, val: id)
.decl FunctionDefinition_kind(id: FunctionDefinitionId, val: FunctionKind)
.decl FunctionDefinition_name(id: FunctionDefinitionId, val: symbol)
.decl FunctionDefinition_virtual(id: FunctionDefinitionId, val: bool)
.decl FunctionDefinition_visibility(id: FunctionDefinitionId, val: FunctionVisibility)
.decl FunctionDefinition_stateMutability(id: FunctionDefinitionId, val: FunctionStateMutability)
.decl FunctionDefinition_isConstructor(id: FunctionDefinitionId, val: bool)
.decl FunctionDefinition_parameters(id: FunctionDefinitionId, val: ParameterListId)
.decl FunctionDefinition_returnParameters(id: FunctionDefinitionId, val: ParameterListId)
.decl FunctionDefinition_overrideSpecifier(id: FunctionDefinitionId, val: OverrideSpecifierId, present: bool)
.decl FunctionDefinition_body(id: FunctionDefinitionId, val: BlockId, present: bool)
Node(id) :- FunctionDefinition(id).
.decl FunctionDefinition(id: FunctionDefinitionId)
.type ExpressionStatementId <: StatementId
.decl ExpressionStatement_expression(id: ExpressionStatementId, val: ExpressionId)
Statement(id) :- ExpressionStatement(id).
Node(id) :- ExpressionStatement(id).
.decl ExpressionStatement(id: ExpressionStatementId)
.type AssignmentId <: ExpressionId
.decl Assignment_typeString(id: AssignmentId, val: symbol)
.decl Assignment_operator(id: AssignmentId, val: symbol)
.decl Assignment_leftHandSide(id: AssignmentId, val: ExpressionId)
.decl Assignment_rightHandSide(id: AssignmentId, val: ExpressionId)
Expression(id) :- Assignment(id).
Node(id) :- Assignment(id).
.decl Assignment(id: AssignmentId)
.type BinaryOperationId <: ExpressionId
.decl BinaryOperation_typeString(id: BinaryOperationId, val: symbol)
.decl BinaryOperation_operator(id: BinaryOperationId, val: symbol)
.decl BinaryOperation_leftExpression(id: BinaryOperationId, val: ExpressionId)
.decl BinaryOperation_rightExpression(id: BinaryOperationId, val: ExpressionId)
.decl BinaryOperation_userFunction(id: BinaryOperationId, val: id, present: bool)
Expression(id) :- BinaryOperation(id).
Node(id) :- BinaryOperation(id).
.decl BinaryOperation(id: BinaryOperationId)
.type IdentifierId <: ExpressionId
.decl Identifier_typeString(id: IdentifierId, val: symbol)
.decl Identifier_name(id: IdentifierId, val: symbol)
.decl Identifier_referencedDeclaration(id: IdentifierId, val: id)
Expression(id) :- Identifier(id).
Node(id) :- Identifier(id).
.decl Identifier(id: IdentifierId)
.type FunctionCallId <: ExpressionId
.decl FunctionCall_typeString(id: FunctionCallId, val: symbol)
.decl FunctionCall_kind(id: FunctionCallId, val: FunctionCallKind)
.decl FunctionCall_expression(id: FunctionCallId, val: ExpressionId)
Expression(id) :- FunctionCall(id).
Node(id) :- FunctionCall(id).
.decl FunctionCall(id: FunctionCallId)
.type LiteralId <: ExpressionId
.decl Literal_typeString(id: LiteralId, val: symbol)
.decl Literal_kind(id: LiteralId, val: LiteralKind)
.decl Literal_hexValue(id: LiteralId, val: symbol)
.decl Literal_value(id: LiteralId, val: symbol)
.decl Literal_subdenomination(id: LiteralId, val: SubdenominationT, present: bool)
Expression(id) :- Literal(id).
Node(id) :- Literal(id).
.decl Literal(id: LiteralId)
.type NewExpressionId <: ExpressionId
.decl NewExpression_typeString(id: NewExpressionId, val: symbol)
.decl NewExpression_typeName(id: NewExpressionId, val: TypeNameId)
Expression(id) :- NewExpression(id).
Node(id) :- NewExpression(id).
.decl NewExpression(id: NewExpressionId)
.type ConditionalId <: ExpressionId
.decl Conditional_typeString(id: ConditionalId, val: symbol)
.decl Conditional_condition(id: ConditionalId, val: ExpressionId)
.decl Conditional_trueExpression(id: ConditionalId, val: ExpressionId)
.decl Conditional_falseExpression(id: ConditionalId, val: ExpressionId)
Expression(id) :- Conditional(id).
Node(id) :- Conditional(id).
.decl Conditional(id: ConditionalId)
.type FunctionCallOptionsId <: ExpressionId
.decl FunctionCallOptions_typeString(id: FunctionCallOptionsId, val: symbol)
.decl FunctionCallOptions_expression(id: FunctionCallOptionsId, val: ExpressionId)
Expression(id) :- FunctionCallOptions(id).
Node(id) :- FunctionCallOptions(id).
.decl FunctionCallOptions(id: FunctionCallOptionsId)
.type UnaryOperationId <: ExpressionId
.decl UnaryOperation_typeString(id: UnaryOperationId, val: symbol)
.decl UnaryOperation_prefix(id: UnaryOperationId, val: bool)
.decl UnaryOperation_operator(id: UnaryOperationId, val: symbol)
.decl UnaryOperation_subExpression(id: UnaryOperationId, val: ExpressionId)
.decl UnaryOperation_userFunction(id: UnaryOperationId, val: id, present: bool)
Expression(id) :- UnaryOperation(id).
Node(id) :- UnaryOperation(id).
.decl UnaryOperation(id: UnaryOperationId)
.type IndexAccessId <: ExpressionId
.decl IndexAccess_typeString(id: IndexAccessId, val: symbol)
.decl IndexAccess_baseExpression(id: IndexAccessId, val: ExpressionId)
.decl IndexAccess_indexExpression(id: IndexAccessId, val: ExpressionId, present: bool)
Expression(id) :- IndexAccess(id).
Node(id) :- IndexAccess(id).
.decl IndexAccess(id: IndexAccessId)
.type MemberAccessId <: ExpressionId
.decl MemberAccess_typeString(id: MemberAccessId, val: symbol)
.decl MemberAccess_expression(id: MemberAccessId, val: ExpressionId)
.decl MemberAccess_memberName(id: MemberAccessId, val: symbol)
.decl MemberAccess_referencedDeclaration(id: MemberAccessId, val: id)
Expression(id) :- MemberAccess(id).
Node(id) :- MemberAccess(id).
.decl MemberAccess(id: MemberAccessId)
.type ElementaryTypeNameExpressionId <: ExpressionId
.decl ElementaryTypeNameExpression_typeString(id: ElementaryTypeNameExpressionId, val: symbol)
.decl ElementaryTypeNameExpression_typeName(id: ElementaryTypeNameExpressionId, val: symbol)
Expression(id) :- ElementaryTypeNameExpression(id).
Node(id) :- ElementaryTypeNameExpression(id).
.decl ElementaryTypeNameExpression(id: ElementaryTypeNameExpressionId)
.type TupleExpressionId <: ExpressionId
.decl TupleExpression_typeString(id: TupleExpressionId, val: symbol)
.decl TupleExpression_isInlineArray(id: TupleExpressionId, val: bool)
Expression(id) :- TupleExpression(id).
Node(id) :- TupleExpression(id).
.decl TupleExpression(id: TupleExpressionId)
.type IndexRangeAccessId <: ExpressionId
.decl IndexRangeAccess_typeString(id: IndexRangeAccessId, val: symbol)
.decl IndexRangeAccess_baseExpression(id: IndexRangeAccessId, val: ExpressionId)
.decl IndexRangeAccess_startExpression(id: IndexRangeAccessId, val: ExpressionId, present: bool)
.decl IndexRangeAccess_endExpression(id: IndexRangeAccessId, val: ExpressionId, present: bool)
Expression(id) :- IndexRangeAccess(id).
Node(id) :- IndexRangeAccess(id).
.decl IndexRangeAccess(id: IndexRangeAccessId)
.type ErrorDefinitionId <: id
.decl ErrorDefinition_name(id: ErrorDefinitionId, val: symbol)
.decl ErrorDefinition_parameters(id: ErrorDefinitionId, val: ParameterListId)
Node(id) :- ErrorDefinition(id).
.decl ErrorDefinition(id: ErrorDefinitionId)
.type UserDefinedValueTypeDefinitionId <: id
.decl UserDefinedValueTypeDefinition_name(id: UserDefinedValueTypeDefinitionId, val: symbol)
.decl UserDefinedValueTypeDefinition_underlyingType(id: UserDefinedValueTypeDefinitionId, val: ElementaryTypeNameId)
Node(id) :- UserDefinedValueTypeDefinition(id).
.decl UserDefinedValueTypeDefinition(id: UserDefinedValueTypeDefinitionId)
.type StructDefinitionId <: id
.decl StructDefinition_name(id: StructDefinitionId, val: symbol)
.decl StructDefinition_scope(id: StructDefinitionId, val: id)
.decl StructDefinition_visibility(id: StructDefinitionId, val: symbol)
Node(id) :- StructDefinition(id).
.decl StructDefinition(id: StructDefinitionId)
.type EnumDefinitionId <: id
.decl EnumDefinition_name(id: EnumDefinitionId, val: symbol)
Node(id) :- EnumDefinition(id).
.decl EnumDefinition(id: EnumDefinitionId)
.type EnumValueId <: id
.decl EnumValue_name(id: EnumValueId, val: symbol)
Node(id) :- EnumValue(id).
.decl EnumValue(id: EnumValueId)
.type EventDefinitionId <: id
.decl EventDefinition_anonymous(id: EventDefinitionId, val: bool)
.decl EventDefinition_name(id: EventDefinitionId, val: symbol)
.decl EventDefinition_parameters(id: EventDefinitionId, val: ParameterListId)
Node(id) :- EventDefinition(id).
.decl EventDefinition(id: EventDefinitionId)
.type ModifierDefinitionId <: id
.decl ModifierDefinition_name(id: ModifierDefinitionId, val: symbol)
.decl ModifierDefinition_virtual(id: ModifierDefinitionId, val: bool)
.decl ModifierDefinition_visibility(id: ModifierDefinitionId, val: symbol)
.decl ModifierDefinition_parameters(id: ModifierDefinitionId, val: ParameterListId)
.decl ModifierDefinition_overrideSpecifier(id: ModifierDefinitionId, val: OverrideSpecifierId, present: bool)
.decl ModifierDefinition_body(id: ModifierDefinitionId, val: BlockId, present: bool)
Node(id) :- ModifierDefinition(id).
.decl ModifierDefinition(id: ModifierDefinitionId)
.type MappingId <: TypeNameId
.decl Mapping_typeString(id: MappingId, val: symbol)
.decl Mapping_keyType(id: MappingId, val: TypeNameId)
.decl Mapping_valueType(id: MappingId, val: TypeNameId)
TypeName(id) :- Mapping(id).
Node(id) :- Mapping(id).
.decl Mapping(id: MappingId)
.type FunctionTypeNameId <: TypeNameId
.decl FunctionTypeName_typeString(id: FunctionTypeNameId, val: symbol)
.decl FunctionTypeName_visibility(id: FunctionTypeNameId, val: FunctionVisibility)
.decl FunctionTypeName_stateMutability(id: FunctionTypeNameId, val: FunctionStateMutability)
.decl FunctionTypeName_parameterTypes(id: FunctionTypeNameId, val: ParameterListId)
.decl FunctionTypeName_returnParameterTypes(id: FunctionTypeNameId, val: ParameterListId)
TypeName(id) :- FunctionTypeName(id).
Node(id) :- FunctionTypeName(id).
.decl FunctionTypeName(id: FunctionTypeNameId)
.type ElementaryTypeNameId <: TypeNameId
.decl ElementaryTypeName_typeString(id: ElementaryTypeNameId, val: symbol)
.decl ElementaryTypeName_name(id: ElementaryTypeNameId, val: symbol)
.decl ElementaryTypeName_stateMutability(id: ElementaryTypeNameId, val: ElementaryTypeNameMutability)
TypeName(id) :- ElementaryTypeName(id).
Node(id) :- ElementaryTypeName(id).
.decl ElementaryTypeName(id: ElementaryTypeNameId)
.type ArrayTypeNameId <: TypeNameId
.decl ArrayTypeName_typeString(id: ArrayTypeNameId, val: symbol)
.decl ArrayTypeName_baseType(id: ArrayTypeNameId, val: TypeNameId)
.decl ArrayTypeName_length(id: ArrayTypeNameId, val: ExpressionId, present: bool)
TypeName(id) :- ArrayTypeName(id).
Node(id) :- ArrayTypeName(id).
.decl ArrayTypeName(id: ArrayTypeNameId)
.type UserDefinedTypeNameId <: TypeNameId
.decl UserDefinedTypeName_typeString(id: UserDefinedTypeNameId, val: symbol)
.decl UserDefinedTypeName_name(id: UserDefinedTypeNameId, val: symbol, present: bool)
.decl UserDefinedTypeName_referencedDeclaration(id: UserDefinedTypeNameId, val: id)
.decl UserDefinedTypeName_path(id: UserDefinedTypeNameId, val: IdentifierPathId, present: bool)
TypeName(id) :- UserDefinedTypeName(id).
Node(id) :- UserDefinedTypeName(id).
.decl UserDefinedTypeName(id: UserDefinedTypeNameId)
.type ForStatementId <: StatementId
.decl ForStatement_body(id: ForStatementId, val: StatementId)
.decl ForStatement_initializationExpression(id: ForStatementId, val: ExpressionId, present: bool)
.decl ForStatement_condition(id: ForStatementId, val: ExpressionId, present: bool)
.decl ForStatement_loopExpression(id: ForStatementId, val: ExpressionStatementId, present: bool)
Statement(id) :- ForStatement(id).
Node(id) :- ForStatement(id).
.decl ForStatement(id: ForStatementId)
.type TryStatementId <: StatementId
.decl TryStatement_externalCall(id: TryStatementId, val: FunctionCallId)
Statement(id) :- TryStatement(id).
Node(id) :- TryStatement(id).
.decl TryStatement(id: TryStatementId)
.type ThrowId <: StatementId
Statement(id) :- Throw(id).
Node(id) :- Throw(id).
.decl Throw(id: ThrowId)
.type BreakId <: StatementId
Statement(id) :- Break(id).
Node(id) :- Break(id).
.decl Break(id: BreakId)
.type EmitStatementId <: StatementId
.decl EmitStatement_eventCall(id: EmitStatementId, val: FunctionCallId)
Statement(id) :- EmitStatement(id).
Node(id) :- EmitStatement(id).
.decl EmitStatement(id: EmitStatementId)
.type InlineAssemblyId <: StatementId
Statement(id) :- InlineAssembly(id).
Node(id) :- InlineAssembly(id).
.decl InlineAssembly(id: InlineAssemblyId)
.type BlockId <: StatementId
Statement(id) :- Block(id).
Node(id) :- Block(id).
.decl Block(id: BlockId)
.type RevertStatementId <: StatementId
.decl RevertStatement_errorCall(id: RevertStatementId, val: FunctionCallId)
Statement(id) :- RevertStatement(id).
Node(id) :- RevertStatement(id).
.decl RevertStatement(id: RevertStatementId)
.type UncheckedBlockId <: StatementId
Statement(id) :- UncheckedBlock(id).
Node(id) :- UncheckedBlock(id).
.decl UncheckedBlock(id: UncheckedBlockId)
.type ReturnId <: StatementId
.decl Return_functionReturnParameters(id: ReturnId, val: number)
.decl Return_expression(id: ReturnId, val: ExpressionId, present: bool)
Statement(id) :- Return(id).
Node(id) :- Return(id).
.decl Return(id: ReturnId)
.type WhileStatementId <: StatementId
.decl WhileStatement_condition(id: WhileStatementId, val: ExpressionId)
.decl WhileStatement_body(id: WhileStatementId, val: StatementId)
Statement(id) :- WhileStatement(id).
Node(id) :- WhileStatement(id).
.decl WhileStatement(id: WhileStatementId)
.type VariableDeclarationStatementId <: StatementId
.decl VariableDeclarationStatement_initialValue(id: VariableDeclarationStatementId, val: ExpressionId, present: bool)
Statement(id) :- VariableDeclarationStatement(id).
Node(id) :- VariableDeclarationStatement(id).
.decl VariableDeclarationStatement(id: VariableDeclarationStatementId)
.type IfStatementId <: StatementId
.decl IfStatement_condition(id: IfStatementId, val: ExpressionId)
.decl IfStatement_trueBody(id: IfStatementId, val: StatementId)
.decl IfStatement_falseBody(id: IfStatementId, val: StatementId, present: bool)
Statement(id) :- IfStatement(id).
Node(id) :- IfStatement(id).
.decl IfStatement(id: IfStatementId)
.type TryCatchClauseId <: StatementId
.decl TryCatchClause_errorName(id: TryCatchClauseId, val: symbol)
.decl TryCatchClause_block(id: TryCatchClauseId, val: BlockId)
.decl TryCatchClause_parameters(id: TryCatchClauseId, val: ParameterListId, present: bool)
Statement(id) :- TryCatchClause(id).
Node(id) :- TryCatchClause(id).
.decl TryCatchClause(id: TryCatchClauseId)
.type DoWhileStatementId <: StatementId
.decl DoWhileStatement_condition(id: DoWhileStatementId, val: ExpressionId)
.decl DoWhileStatement_body(id: DoWhileStatementId, val: StatementId)
Statement(id) :- DoWhileStatement(id).
Node(id) :- DoWhileStatement(id).
.decl DoWhileStatement(id: DoWhileStatementId)
.type ContinueId <: StatementId
Statement(id) :- Continue(id).
Node(id) :- Continue(id).
.decl Continue(id: ContinueId)
.type PlaceholderStatementId <: StatementId
Statement(id) :- PlaceholderStatement(id).
Node(id) :- PlaceholderStatement(id).
.decl PlaceholderStatement(id: PlaceholderStatementId)
.type ParameterListId <: id
Node(id) :- ParameterList(id).
.decl ParameterList(id: ParameterListId)
.type InheritanceSpecifierId <: id
.decl InheritanceSpecifier_baseType(id: InheritanceSpecifierId, val: id)
Node(id) :- InheritanceSpecifier(id).
.decl InheritanceSpecifier(id: InheritanceSpecifierId)
.type UsingForDirectiveId <: id
.decl UsingForDirective_isGlobal(id: UsingForDirectiveId, val: bool)
.decl UsingForDirective_libraryName(id: UsingForDirectiveId, val: id, present: bool)
.decl UsingForDirective_typeName(id: UsingForDirectiveId, val: TypeNameId, present: bool)
Node(id) :- UsingForDirective(id).
.decl UsingForDirective(id: UsingForDirectiveId)
.type IdentifierPathId <: id
.decl IdentifierPath_name(id: IdentifierPathId, val: symbol)
.decl IdentifierPath_referencedDeclaration(id: IdentifierPathId, val: id)
Node(id) :- IdentifierPath(id).
.decl IdentifierPath(id: IdentifierPathId)
.type PragmaDirectiveId <: id
Node(id) :- PragmaDirective(id).
.decl PragmaDirective(id: PragmaDirectiveId)
.type ModifierInvocationId <: id
.decl ModifierInvocation_modifierName(id: ModifierInvocationId, val: id)
.decl ModifierInvocation_kind(id: ModifierInvocationId, val: ModifierInvocationKind, present: bool)
Node(id) :- ModifierInvocation(id).
.decl ModifierInvocation(id: ModifierInvocationId)
.type ImportDirectiveId <: id
.decl ImportDirective_file(id: ImportDirectiveId, val: symbol)
.decl ImportDirective_absolutePath(id: ImportDirectiveId, val: symbol)
.decl ImportDirective_unitAlias(id: ImportDirectiveId, val: symbol)
.decl ImportDirective_scope(id: ImportDirectiveId, val: SourceUnitId)
.decl ImportDirective_sourceUnit(id: ImportDirectiveId, val: SourceUnitId)
Node(id) :- ImportDirective(id).
.decl ImportDirective(id: ImportDirectiveId)
.type OverrideSpecifierId <: id
Node(id) :- OverrideSpecifier(id).
.decl OverrideSpecifier(id: OverrideSpecifierId)
.type StructuredDocumentationId <: id
.decl StructuredDocumentation_text(id: StructuredDocumentationId, val: symbol)
Node(id) :- StructuredDocumentation(id).
.decl StructuredDocumentation(id: StructuredDocumentationId)`;
