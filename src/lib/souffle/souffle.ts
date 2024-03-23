import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import { datalogFromUnits } from "../translate";
import { searchRecursive } from "../utils";
import { ANALYSES_DIR } from "../analyses";
import { DETECTORS_DIR } from "../detectors";
import { Issue, getIssues, loadDetectors, parseTemplateSignature } from "../detector";
import * as dl from "souffle.ts";

export type OutputRelations = Map<string, dl.Fact[]>;

function getDLFromFolder(folder: string): string {
    const fileNames = searchRecursive(folder, (f) => f.endsWith(".dl"));

    const contents = fileNames.map(
        (fileName) => `////// ${fileName} \n` + fse.readFileSync(fileName, { encoding: "utf-8" })
    );

    return contents.join("\n");
}

function getAnalyses(): string {
    return getDLFromFolder(ANALYSES_DIR);
}

function getDetectors(): string {
    return getDLFromFolder(DETECTORS_DIR);
}

export function buildDatalog(units: sol.SourceUnit[], infer: sol.InferType): string {
    const unitsDL = datalogFromUnits(units, infer);
    const analyses = getAnalyses();
    const detectors = getDetectors();
    return [
        unitsDL,
        "// ======= ANALYSIS RELS =======",
        analyses,
        "// ======= DETECTORS RELS =======",
        detectors
    ].join("\n");
}

/**
 * Helper function to analyze a bunch of solc-typed-ast SourceUnits and output some of the relations
 */
export async function analyze(
    units: sol.SourceUnit[],
    infer: sol.InferType,
    mode: dl.SouffleOutputType,
    outputRelations: string[],
    soDir?: string
): Promise<dl.SouffleCSVInstance | dl.SouffleSQLiteInstance> {
    const datalog = buildDatalog(units, infer);

    const instance =
        mode === "csv"
            ? new dl.SouffleCSVInstance(datalog, soDir)
            : new dl.SouffleSQLiteInstance(datalog, soDir);

    await instance.run(outputRelations);
    return instance;
}

/**
 * Helper function to run all detectors and ouput just their results
 */
export async function detect(
    units: sol.SourceUnit[],
    context: sol.ASTContext,
    infer: sol.InferType
): Promise<Issue[]> {
    const detectorTemplates = loadDetectors();
    const outputRelations = detectorTemplates.map(
        (template) => parseTemplateSignature(template.relationSignature)[0]
    );

    const instance = (await analyze(units, infer, "csv", outputRelations)) as dl.SouffleCSVInstance;
    const outputs = await instance.allFacts();
    instance.release();

    const res = getIssues(outputs, context);

    return res;
}
