import { spawnSync } from "child_process";
import crypto from "crypto";
import fse from "fs-extra";
import os from "os";
import path from "path";
import * as sol from "solc-typed-ast";
import { datalogFromUnits } from "./translate";
import { parse } from "csv-parse/sync";
import { searchRecursive } from "./utils";

export function souffle(datalog: string): string {
    const tmpDir = os.tmpdir();

    let fileName: string;

    do {
        fileName = path.join(tmpDir, "datalog-" + crypto.randomBytes(16).toString("hex") + ".dl");
    } while (fse.existsSync(fileName));

    fse.writeFileSync(fileName, datalog, { encoding: "utf-8" });

    const result = spawnSync("souffle", ["--wno", "all", fileName], { encoding: "utf-8" });

    fse.removeSync(fileName);

    if (result.status !== 0) {
        throw new Error(
            `Souffle terminated with non-zero exit code (${result.status}): ${result.stderr}`
        );
    }

    return result.stdout;
}

export function getDLFromFolder(folder: string): string {
    const fileNames = searchRecursive(folder, (f) => f.endsWith(".dl"));

    const contents = fileNames.map(
        (fileName) => `////// ${fileName} \n` + fse.readFileSync(fileName, { encoding: "utf-8" })
    );

    return contents.join("\n");
}

export function getAnalyses(): string {
    const analysesBaseDir = path.join(__dirname, "../analyses");
    return getDLFromFolder(analysesBaseDir);
}

export function getDetectors(): string {
    const analysesBaseDir = path.join(__dirname, "../detectors");
    return getDLFromFolder(analysesBaseDir);
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

export function analyze(units: sol.SourceUnit[], additionalDatalog: string): string {
    const datalog = [
        buildDatalog(units),
        "// ======= ADDITIONAL DATALOG =======",
        additionalDatalog
    ].join("\n");

    return souffle(datalog);
}

function extractOutputRelations(datalog: string): string[] {
    const rxOutRel = /\.output\s+(\w+)/g;
    const result: string[] = [];

    let matches: RegExpExecArray | null;

    while ((matches = rxOutRel.exec(datalog))) {
        result.push(matches[1]);
    }

    return result;
}

export function parseCsv(content: string, delimiter = "\t"): string[][] {
    const config = {
        skipEmptyLines: true,
        cast: true,
        delimiter
    };

    return parse(content, config);
}

export function readProducedCsvFiles(datalog: string): Map<string, string[][]> {
    const outRels = extractOutputRelations(datalog);
    const relMap = new Map<string, string[][]>();

    for (const rel of outRels) {
        const fileName = rel + ".csv";

        if (fse.existsSync(fileName)) {
            const content = fse.readFileSync(fileName, { encoding: "utf-8" });
            const entries = parseCsv(content);

            relMap.set(rel, entries);

            fse.removeSync(fileName);
        }
    }

    return relMap;
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
