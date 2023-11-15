import * as sol from "solc-typed-ast";

export function flatten<T>(arg: T[][]): T[] {
    const res: T[] = [];
    for (const x of arg) {
        res.push(...x);
    }

    return res;
}

/**
 * Convert a TS list into a datalog "recursive" list.
 */
export function listify(lst: string[]): string {
    if (lst.length === 0) {
        return `nil`;
    }

    return lst.reduceRight((x, y) => `[${y}, ${x}]`, "nil");
}

/**
 * Convert a TS bool into a datalog "bool"
 */
export function boolify(b: boolean): string {
    // For now we define bool in datalog as number
    return b ? "1" : "0";
}

/**
 * Helper to translate a symbol map into the underlying datalog record type
 */
export function translateSymbolsMap(a: Map<string, number>): string {
    if (a.size === 0) {
        return `nil`;
    }

    return [...a.entries()].reduceRight((acc, [name, id]) => `[${id}, "${name}", ${acc}]`, "nil");
}

/**
 * Helper to translate an expressions map into the underlying datalog record type
 */
export function translateExpressionsMap(a: Map<string, sol.Expression>): string {
    if (a.size === 0) {
        return `nil`;
    }

    return [...a.entries()].reduceRight(
        (acc, [name, expr]) => `["${name}", ${expr.id}, ${acc}]`,
        "nil"
    );
}

export function translateUsingForFunctionList(
    lst: Array<sol.IdentifierPath | sol.UsingCustomizedOperator>
): string {
    if (lst.length === 0) {
        return `nil`;
    }

    return lst.reduceRight(
        (acc, el) =>
            el instanceof sol.IdentifierPath
                ? `["${el.id}", "", ${acc}]`
                : `["${el.definition.id}", "${el.operator}", ${acc}]`,
        "nil"
    );
}

// Helper class to pass a string to `translateVals` that shouldn't be quoted
export class Literal {
    constructor(public v: string) {}
}

export function sanitizeString(s: string): string {
    // For various compiler versions a string may be missing in the AST
    if (s === null || s === undefined) {
        s = "";
    }

    return s
        .replaceAll('"', "'") // Only single quotes
        .replaceAll("\n", "\\n") // Escape new lines
        .replaceAll("\r", "\\r") // Escape carriage return
        .replaceAll(/[^\x20-\x7E]+/g, ""); // Remove remaining unicode characters
}

function translateVal(a: any): string {
    if (typeof a === "string") {
        return `"${a}"`;
    }

    if (typeof a === "boolean") {
        return boolify(a);
    }

    if (typeof a === "number") {
        return `${a}`;
    }

    if (a instanceof sol.ASTNode) {
        return `${a.id}`;
    }

    if (a instanceof Array) {
        return listify(a.map(translateVal));
    }

    if (a instanceof Literal) {
        return a.v;
    }

    console.trace();

    throw new Error(`Don't know how to translate ${a}`);
}

export function translateVals(...a: any[]): string[] {
    // console.error(`translateVals`, a);
    return a.map(translateVal);
}
