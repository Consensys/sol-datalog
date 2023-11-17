import { spawnSync } from "child_process";
import fse from "fs-extra";
import os from "os";
import path, { basename, join } from "path";
import * as sol from "solc-typed-ast";
import { datalogFromUnits } from "./translate";
import { parse } from "csv-parse/sync";
import { searchRecursive } from "./utils";
import { ANALYSES_DIR } from "./analyses";
import { DETECTORS_DIR } from "./detectors";

export type OutputRelations = Map<string, string[][]>;

/**
 * Given some input datalog:
 *
 * 1. Make temp dir
 * 2. Write datalog to file
 * 3. Run souffle
 * 4. Read resulting relations from tmp dir
 * 5. Cleanup and return resulting relations
 */
async function souffle(datalog: string): Promise<OutputRelations> {
    const sysTmpDir = os.tmpdir();
    const tmpDir = await fse.mkdtempSync(join(sysTmpDir, "sol-datalog-"));

    const fileName: string = path.join(tmpDir, "input.dl");
    fse.writeFileSync(fileName, datalog, { encoding: "utf-8" });

    const result = spawnSync("souffle", ["--wno", "all", "-D", tmpDir, fileName], {
        encoding: "utf-8"
    });

    if (result.status !== 0) {
        throw new Error(
            `Souffle terminated with non-zero exit code (${result.status}): ${result.stderr}`
        );
    }

    fse.removeSync(fileName);

    const res = readProducedCsvFiles(tmpDir);

    fse.rmdirSync(tmpDir);
    return res;
}

export function readProducedCsvFiles(dir: string): Map<string, string[][]> {
    const relMap = new Map<string, string[][]>();
    const outputFiles = searchRecursive(dir, (x) => x.endsWith(".csv"));

    for (const fileName of outputFiles) {
        const rel = basename(fileName, ".csv");

        const content = fse.readFileSync(fileName, { encoding: "utf-8" });
        const entries = parseCsv(content);

        relMap.set(rel, entries);

        fse.removeSync(fileName);
    }

    return relMap;
}

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

export async function analyze(units: sol.SourceUnit[]): Promise<OutputRelations> {
    const datalog = [buildDatalog(units)].join("\n");
    return souffle(datalog);
}

function parseCsv(content: string, delimiter = "\t"): string[][] {
    const config = {
        skipEmptyLines: true,
        cast: true,
        delimiter
    };

    return parse(content, config);
}

export function readProducedOutput(output: string): Map<string, string[][]> {
    const relMarker = "---------------";
    const bodyMarker = "===============";
    const relMap = new Map<string, string[][]>();

    let idxRel = output.indexOf(relMarker);

    while (idxRel > -1) {
        const idxBodyStart = output.indexOf(bodyMarker, idxRel + relMarker.length);
        const idxBodyFinish = output.indexOf(bodyMarker, idxBodyStart + bodyMarker.length);

        const rel = output.slice(idxRel + relMarker.length, idxBodyStart).trim();
        const body = output.slice(idxBodyStart + bodyMarker.length, idxBodyFinish).trim();

        const entries = parseCsv(body);

        relMap.set(rel, entries);

        idxRel = output.indexOf(relMarker, idxBodyFinish + bodyMarker.length);
    }

    return relMap;
}
