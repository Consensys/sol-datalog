import * as sol from "solc-typed-ast";

export class UnitCompiler {
    constructor(private readonly units: sol.SourceUnit[]) {}

    compile(): string {
        const facts: string[] = [];

        for (const unit of this.units) {
            facts.push(...this.compileSourceUnit(unit));
        }

        return facts.join("\n");
    }

    private compileSourceUnit(n: sol.SourceUnit): string[] {}
}
export function translate(units: sol.SourceUnit[]): string[] {}
