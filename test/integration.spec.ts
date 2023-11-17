import expect from "expect";
import fse from "fs-extra";
import path from "path";
import { spawnSync } from "child_process";
import * as sol from "solc-typed-ast";
import { datalogFromUnits } from "../src";
import { searchRecursive } from "../src/lib/utils";

require("dotenv").config();

const TMP_DIR = "tmp/";

const skip = new Set<string>([]);

const samples = searchRecursive(
    path.join(process.env["SOLC_TYPED_AST_DIR"] as string, "../test/samples/solidity"),
    (fileName) => fileName.endsWith(".sol") && !skip.has(path.basename(fileName))
);

describe("Integration test on samples", () => {
    for (const sample of samples) {
        describe(sample, () => {
            let units: sol.SourceUnit[];
            let datalog: string;

            before(async () => {
                const result = await sol.compileSol(sample, "auto");

                const data = result.data;
                const errors = sol.detectCompileErrors(data);

                expect(errors).toHaveLength(0);

                units = new sol.ASTReader().read(data);

                expect(units.length).toBeGreaterThanOrEqual(1);

                datalog = `// ${sample}\n` + datalogFromUnits(units);
            });

            after(() => {
                /**
                 * Comment this out if you want to preserve TMP_DIR for debug purposes
                 */
                if (fse.existsSync(TMP_DIR)) {
                    fse.rmSync(TMP_DIR, { recursive: true, force: true });
                }
            });

            it("each AST node is expressed in datalog by fact", () => {
                const missing = new Set<sol.ASTNode>();

                for (const unit of units) {
                    unit.walk((node) => {
                        const rx = new RegExp(
                            `${node.type}\\(${node.id}, "${node.src}".*\\)`,
                            "gm"
                        );

                        if (!rx.test(datalog)) {
                            missing.add(node);
                        }
                    });
                }

                sol.assert(missing.size === 0, `Missing nodes {0}`, missing);
            });

            it("souffle is able to process the output", () => {
                const fileName = path.join(
                    TMP_DIR,
                    sample.slice(sample.indexOf("solidity/") + 9).replace(".sol", ".dl")
                );

                // console.log(fileName);
                // console.log(datalog);

                fse.ensureFileSync(fileName);
                fse.writeFileSync(fileName, datalog, { encoding: "utf-8" });

                const souffleResult = spawnSync("souffle", [fileName], { encoding: "utf-8" });

                expect(souffleResult.status).toEqual(0);
            });
        });
    }
});
