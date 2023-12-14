export type ParsedFieldVal = string | number | bigint | ParsedFieldVal[] | null;

export function parseValue(source: string): ParsedFieldVal {
    // @ts-ignore
    return parse(source);
}
