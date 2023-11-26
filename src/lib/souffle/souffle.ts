import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import { datalogFromUnits } from "../translate";
import { searchRecursive } from "../utils";
import { ANALYSES_DIR } from "../analyses";
import { DETECTORS_DIR } from "../detectors";
import { SouffleCSVInstance, SouffleOutputType, SouffleSQLiteInstance } from "./instance";
import { Issue, getIssues, loadDetectors, parseTemplateSignature } from "../detector";

export type OutputRelations = Map<string, string[][]>;

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

export function buildDatalog(units: sol.SourceUnit[]): string {
    const unitsDL = datalogFromUnits(units);
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
    mode: SouffleOutputType,
    outputRelations: string[]
): Promise<SouffleCSVInstance | SouffleSQLiteInstance> {
    const datalog = buildDatalog(units);

    const instance =
        mode === "csv" ? new SouffleCSVInstance(datalog) : new SouffleSQLiteInstance(datalog);

    await instance.run(outputRelations);
    return instance;
}

/**
 * Helper function to run all detectors and ouput just their results
 */
export async function detect(units: sol.SourceUnit[], context: sol.ASTContext): Promise<Issue[]> {
    const detectorTemplates = loadDetectors();
    const outputRelations = detectorTemplates.map(
        (template) => parseTemplateSignature(template.relationSignature)[0]
    );

    const instance = (await analyze(units, "csv", outputRelations)) as SouffleCSVInstance;
    const outputs = instance.results();
    instance.release();

    const res = getIssues(outputs, context);

    return res;
}
