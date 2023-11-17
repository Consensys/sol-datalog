import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import { searchRecursive } from "./utils";
import { OutputRelations } from "./souffle";
import { DETECTORS_DIR } from "./detectors";

type SignatureArgs = Array<[string, string]>;
type ParsedSignature = [string, SignatureArgs];
type SubstMap = Map<string, number | string | bigint>;

interface DetectorTemplate {
    fileName: string;
    relationSignature: string;
    locations: string[];
    canonicalLocation: string;
    description: {
        head: string;
        tail: string;
    };
}

export interface Issue {
    locations: string[];
    canonicalLocation: string;
    description: {
        head: string;
        tail: string;
    };
}

function loadDetectorTemplate(jsonPath: string): DetectorTemplate {
    return fse.readJSONSync(jsonPath) as DetectorTemplate;
}

export function loadDetectors(): DetectorTemplate[] {
    const fileNames = searchRecursive(DETECTORS_DIR, (f) => f.endsWith(".json"));

    return fileNames.map(loadDetectorTemplate);
}

function parseTemplateSignature(sig: string): ParsedSignature {
    const nameRX = /^([^(]*)\(([^)]*)\)$/;
    const m = sig.match(nameRX);

    sol.assert(m !== null, ``);

    const name = m[1];
    const args = m[2]
        .split(",")
        .map((x) => x.trim())
        .map((x) => x.split(":").map((x) => x.trim())) as SignatureArgs;

    return [name, args];
}

function makeSubst(formals: SignatureArgs, relnVals: string[]): SubstMap {
    const res = new Map();

    sol.assert(
        formals.length === relnVals.length,
        `Mismatch in number of formals {0} and number of vals {1}`,
        formals.length,
        relnVals.length
    );

    for (let i = 0; i < formals.length; i++) {
        const [name, type] = formals[i];

        let val;

        if (type === "id" || type.endsWith("Id")) {
            val = Number.parseInt(relnVals[i]);
        } else if (type === "number") {
            val = BigInt(relnVals[i]);
        } else {
            val = relnVals[i];
        }

        res.set(name, val);
    }

    return res;
}

// @todo This whole "parsing" thing is hacky. If we end up using this templating
// thing more use a proper grammar.
const fmtHoleRx = /{[^}]*}/;
const fmtId = /[a-zA-Z][a-zA-Z0-9_]*/;
const fmtMemberAcc = /([a-zA-Z][a-zA-Z0-9_]*)\.([a-zA-Z][a-zA-Z0-9_]*)/;

/**
 * Get the field `field` of object `nd`. Handles getters.
 */
function getField(nd: sol.ASTNode, field: string): any {
    const desc = Object.getOwnPropertyDescriptor(nd, field);

    if (desc) {
        return desc.value;
    }

    const getterDesc = Object.getOwnPropertyDescriptor(nd.constructor.prototype, field);

    sol.assert(
        getterDesc !== undefined && getterDesc.get !== undefined,
        `No property {0} on object of type {1}`,
        field,
        nd.constructor.name
    );

    return getterDesc.get.bind(nd)();
}

/**
 * Given a string template, with patterns such as {a} and {a.x}, a relation
 * substitution, and an AST Context, return the formatted string.
 */
function fmt(template: string, subst: SubstMap, ctx: sol.ASTContext): string {
    let m;

    while (true) {
        m = template.match(fmtHoleRx);

        if (m === null) {
            break;
        }

        const pattern = m[0];

        let m1 = pattern.match(fmtMemberAcc);

        if (m1 !== null) {
            const argName = m1[1];
            const field = m1[2];

            const id = subst.get(argName);

            sol.assert(typeof id === "number", `Expected {0} to be a number, not {1}`, argName, id);

            const node = ctx.locate(id);
            const fieldVal = getField(node, field);

            template = template.replace(fmtHoleRx, sol.pp(fieldVal));
            continue;
        }

        m1 = pattern.match(fmtId);
        if (m1 !== null) {
            const argName = m1[1];
            const val = subst.get(argName);

            sol.assert(val !== undefined, `Unknown field {0}`, argName);

            template = template.replace(fmtHoleRx, sol.pp(val));
            continue;
        }

        throw new Error(`Unknown template pattern ${pattern}`);
    }

    return template;
}

export function getIssues(output: OutputRelations, ctx: sol.ASTContext): Issue[] {
    const res: Issue[] = [];
    // Load detector templates
    const detectorMap = new Map<string, [SignatureArgs, DetectorTemplate]>();

    for (const template of loadDetectors()) {
        const [name, args] = parseTemplateSignature(template.relationSignature);

        detectorMap.set(name, [args, template]);
    }

    // Parse results
    for (const [name, facts] of output) {
        if (!detectorMap.has(name)) {
            continue;
        }

        const [args, template] = detectorMap.get(name) as [SignatureArgs, DetectorTemplate];
        for (const relnVals of facts) {
            const subst = makeSubst(args, relnVals);

            res.push({
                locations: template.locations.map((x) => fmt(x, subst, ctx)),
                canonicalLocation: fmt(template.canonicalLocation, subst, ctx),
                description: {
                    head: fmt(template.description.head, subst, ctx),
                    tail: fmt(template.description.tail, subst, ctx)
                }
            });
        }
    }

    return res;
}
