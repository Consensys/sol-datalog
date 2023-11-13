Program
    = __ t: (d: Declaration __ { return d; })* { return t; };

/// Declarations
Declaration
    = Directive

Directive
    = DirectiveQualifier _ 

DirectiveQualifier
    = INPUT
    / OUTPUT

Identifier
    = [a-zA-Z][a-zA-Z0-9_]*

QualifiedName =
    head: Identifier
    tail: ("." Identifier)*

// Keywords
INPUT = ".input"
OUTPUT = ".output"