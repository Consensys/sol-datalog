import { spawnSync } from "child_process";
import crypto from "crypto";
import fse from "fs-extra";
import os from "os";
import path from "path";
import * as sol from "solc-typed-ast";
import { datalogFromUnits } from "./translate";

export function souffle(datalog: string): string {
    const tmpDir = os.tmpdir();

    let fileName: string;

    do {
        fileName = path.join(tmpDir, "datalog-" + crypto.randomBytes(16).toString("hex") + ".dl");
    } while (fse.existsSync(fileName));

    fse.writeFileSync(fileName, datalog, { encoding: "utf-8" });

    const result = spawnSync("souffle", [fileName], { encoding: "utf-8" });

    fse.removeSync(fileName);

    if (result.status !== 0) {
        throw new Error(
            `Souffle terminated with non-zero exit code (${result.status}): ${result.stderr}`
        );
    }

    return result.stdout;
}

export function analyze(units: sol.SourceUnit[], analysis: string): string {
    const datalog = [datalogFromUnits(units), "// ======= ANALYSIS RELS =======", analysis].join(
        "\n"
    );

    return souffle(datalog);
}
