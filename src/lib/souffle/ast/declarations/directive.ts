import { Node, Src } from "../node";
import { Declaration } from "./declaration";

export type DirectiveValue = string | boolean | number;
export class Directive extends Declaration {
    constructor(
        public readonly type: string,
        public readonly name: string,
        public readonly parameters: Array<[string, DirectiveValue]>,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}${this.type} ${this.name}(${this.parameters
            .map(([name, val]) => `${name} = ${val}`)
            .join(", ")})`;
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [this.type, this.name, ...this.parameters];
    }
}
