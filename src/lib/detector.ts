import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import path from "path";
import { searchRecursive } from "./utils";

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

function loadDetectors(): DetectorTemplate[] {
    const folder = path.join(__dirname, "../detectors");
    const fileNames = searchRecursive(folder, (f) => f.endsWith(".json"));

    return fileNames.map(loadDetectorTemplate);
}

type SignatureArgs = Array<[string, string]>;
type ParsedSignature = [string, SignatureArgs];

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

function makeArgsMap(
    formals: SignatureArgs,
    relnVals: string[]
): Map<string, number | bigint | string> {
    const res = new Map<string, number | string | bigint>();

    sol.assert(
        formals.length === relnVals.length,
        `Mismatch in number of formals {0} and number of vals {1]}`,
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

export type OutputRelations = Map<string, string[][]>;

export function getIssues(output: OutputRelations): void {
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
            const subst = makeArgsMap(args, relnVals);
        }
    }
}
