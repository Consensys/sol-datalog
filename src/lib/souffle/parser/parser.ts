import { Program } from "../ast";

const Parser = (require("./souffle_parser_gen") as any).Parser;
const parser = new Parser();

export function parseProgram(s: string): Program {
    return parser.parse(s);
}
