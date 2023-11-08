export const outputRelations: string = `
// Compute whether a node with ancestorId is the ancestor of a node with descendantId in the AST.
.decl ancestor(ancestorId: id, descendantId: id)

ancestor(x, y) :- parent(x, y).
ancestor(x, y) :- parent(x, z), ancestor(z, y).

// Compute whether there is a state var VariableDeclaration with a given name and id
.decl stateVar(name: symbol, id: id)
stateVar(name, id) :- VariableDeclaration(id, _, _, _, name, _, 1, _, _, _, _, _, _, _, _, _, _).

// Compute whether there is a function definition with a given name and id
.decl function(name: symbol, id: id)
function(name, id) :- FunctionDefinition(id, _, _, _, name, _, _, _, _, _, _, _, _, _, _, _).

// Compute whether there is a contract definition with a given name and id
.decl contract(name: symbol, id: id)
contract(name, id) :- ContractDefinition(id, _, name, _, _, _, _, _, _).


// Compute whether a state var with a given id is modified in a LHS expression
.decl stateVarModifiedInLHS(varId: id, exprId: id)
.output stateVarModifiedInLHS 

// Simple reference to the variable
stateVarModifiedInLHS(varId, exprId) :-
    Identifier(exprId, _, _, _, varId).
// A member access referring to the variable (e.g. this.x, Foo.x)
stateVarModifiedInLHS(varId, exprId) :-
    MemberAccess(exprId, _, _, _, _, varId).
// A struct member access x.foo
stateVarModifiedInLHS(varId, exprId) :-
    MemberAccess(exprId, _, _, subExprId, _, _), stateVarModifiedInLHS(varId, subExprId). // A str
// An index into the state var x[a]
stateVarModifiedInLHS(varId, exprId) :-
    IndexAccess(exprId, _, _, baseExprId, _, _), stateVarModifiedInLHS(varId, baseExprId).
// An tuple expression
stateVarModifiedInLHS(varId, exprId) :-
    TupleExpression(exprId, _, _, 0, _), 
    parent(exprId, componentId),
    componentId >= 0,
    stateVarModifiedInLHS(varId, componentId).

// Compute whether the state var identifier by varId is mutated in the assignment identified by assignmentId
.decl varModifiedInLHSOfAssignment(varId: id, assignmentId: id)
.output varModifiedInLHSOfAssignment

// Simple assignment case
varModifiedInLHSOfAssignment(varId, assignmentId) :-
    Assignment(assignmentId, _, _, _, lhsId, _),
    stateVarModifiedInLHS(varId, lhsId).

// Compute whether the state var "varContractName.stateVarName" is changed  inside the method "funContractName.funName"
.decl stateVarAssignedIn(varContractName: symbol, stateVarName: symbol, funContractName: symbol, funName: symbol)
.output stateVarAssignedIn 

stateVarAssignedIn(varContractName, stateVarName, funContractName, funName) :-
    contract(varContractName, varContractId),
    contract(funContractName, funContractId),
    stateVar(stateVarName, sId),
    ancestor(varContractId, sId),
    function(funName, fId),
    ancestor(funContractId, fId),
    Assignment(assignId, _, _, _, _, _),
    ancestor(fId, assignId),
    varModifiedInLHSOfAssignment(sId, assignId).

.decl tupleComponents(t: id, components: ExpressionIdList)
.output tupleComponents
tupleComponents(t, components) :- TupleExpression(t, _, _, _, components).
`;
