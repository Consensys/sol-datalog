import expect from "expect";
import fse from "fs-extra";
import path from "path";
import { searchRecursive } from "./utils";
import { spawnSync } from "child_process";

require("dotenv").config();

const TMP_DIR = "tmp/";

const skip = new Set<string>([]);

const samples = searchRecursive(
    path.join(process.env["SOLC_TYPED_AST_DIR"] as string, "../test/samples/solidity"),
    (fileName) => fileName.endsWith(".sol") && !skip.has(path.basename(fileName))
);

describe("sol-datalog processes samples", () => {
    for (const sample of samples) {
        describe(sample, () => {
            let exitCode: number | null;
            let outData: string;
            let errData: string;

            before(() => {
                const solDatalogResult = spawnSync("sol-datalog-cli", [sample], {
                    encoding: "utf-8"
                });

                outData = solDatalogResult.stdout;
                errData = solDatalogResult.stderr;
                exitCode = solDatalogResult.status;

                expect(exitCode).toEqual(0);
                expect(errData).toContain("");
            });

            after(() => {
                /**
                 * Comment this out if you want to preserve TMP_DIR for debug purposes
                 */
                if (fse.existsSync(TMP_DIR)) {
                    fse.rmSync(TMP_DIR, { recursive: true, force: true });
                }
            });

            it("souffle is able to process the output", () => {
                const fileName = path.join(
                    TMP_DIR,
                    sample.slice(sample.indexOf("solidity/") + 9).replace(".sol", ".dl")
                );

                const content = `// ${sample}\n${outData}`;

                // console.log(fileName);
                // console.log(content);

                fse.ensureFileSync(fileName);
                fse.writeFileSync(fileName, content, { encoding: "utf-8" });

                const souffleResult = spawnSync("souffle", [fileName], { encoding: "utf-8" });

                expect(souffleResult.status).toEqual(0);
            });
        });
    }
});
