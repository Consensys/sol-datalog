{
    location;
    expected;
    error;
    peg$anyExpectation;
}

Value
    = Number
    / String
    / Record

Record
    = LBRACE __ lst: ValueList __ RBRACE { return lst; }
    / NIL { return null; }

ValueList
    = head: Value tail: ( __ COMMA __ t: Value { return t; })* {
        return [head, ...tail];
    }

String
    = DBLQUOTE contents: [^"]* DBLQUOTE {
        return contents.join("")
    }

    
DecDigit =
    [0-9]

DecNumber = 
    DecDigit+ {
        return Number(text());
    }
    
MaybeNegNumber
    = sign: "-"? __ num: DecNumber {
        if (sign === null) {
            return num;
        }

        return -num;
    }    

Number = MaybeNegNumber

DBLQUOTE="\""
LBRACE="["
RBRACE="]"
COMMA=","
NIL="nil"

__ =
    (WhiteSpace / LineTerminator)*

PrimitiveWhiteSpace =
    "\t"
    / "\v"
    / "\f"
    / " "
    / "\u00A0"
    / "\uFEFF"
    / Zs

Zs =
    [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

LineTerminator =
    [\n\r\u2028\u2029]
    
WhiteSpace =
    PrimitiveWhiteSpace