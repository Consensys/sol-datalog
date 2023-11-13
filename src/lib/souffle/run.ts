import { spawnSync } from "child_process";
import crypto from "crypto";
import fse from "fs-extra";
import os from "os";
import path from "path";
import * as sol from "solc-typed-ast";
import { datalogFromUnits } from "../translate";
import { parse } from "csv-parse/sync";

export function souffle(datalog: string): string {
    const tmpDir = os.tmpdir();

    let fileName: string;

    do {
        fileName = path.join(tmpDir, "datalog-" + crypto.randomBytes(16).toString("hex") + ".dl");
    } while (fse.existsSync(fileName));

    fse.writeFileSync(fileName, datalog, { encoding: "utf-8" });

    const result = spawnSync("souffle", [fileName], { encoding: "utf-8" });

    if (result.status !== 0) {
        throw new Error(
            `Souffle terminated with non-zero exit code (${result.status}): ${result.stderr}. Input in ${fileName}`
        );
    } else {
        fse.removeSync(fileName);
    }

    return result.stdout;
}

export function getDefinedAnalyses(): string {
    const analysesBaseDir = path.join(__dirname, "../analyses");
    const fileNames = ["state_var_modified.dl"].map((n) => path.join(analysesBaseDir, n));

    const contents = fileNames.map(
        (fileName) => `////// ${fileName} \n` + fse.readFileSync(fileName, { encoding: "utf-8" })
    );

    return contents.join("\n");
}

export function analyze(units: sol.SourceUnit[], additionalDatalog: string): string {
    const unitsDL = datalogFromUnits(units);
    const definedAnalyses = getDefinedAnalyses();
    const datalog = [
        unitsDL,
        "// ======= ANALYSIS RELS =======",
        definedAnalyses,
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
