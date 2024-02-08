import expect from "expect";
import fse from "fs-extra";
import path from "path";
import { spawnSync } from "child_process";
import * as sol from "solc-typed-ast";
import { datalogFromUnits } from "../src";
import { searchRecursive } from "../src/lib/utils";

require("dotenv").config();

const TMP_DIR = "tmp/";

// These files in solc-typed-ast don't compile on their own. So skip em.
const skipSamples: string[] = [
    "test/samples/solidity/error.sol",
    "test/samples/solidity/latest_08.sourced.sol",
    "test/samples/solidity/meta/complex_imports/c.sourced.sol",
    "test/samples/solidity/meta/imports/lib/B.sol",
    "test/samples/solidity/meta/imports/lib2/C.sol",
    "test/samples/solidity/meta/imports/lib2/D.sol",
    "test/samples/solidity/path_remapping/entry.sol",
    "test/samples/solidity/features_0824.sol"
];

const samples = searchRecursive(
    path.join(process.env["SOLC_TYPED_AST_DIR"] as string, "../test/samples/solidity"),
    (fileName) => fileName.endsWith(".sol") && !sol.forAny(skipSamples, (x) => fileName.endsWith(x))
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

                const infer = new sol.InferType(result.compilerVersion as string);

                datalog = `// ${sample}\n` + datalogFromUnits(units, infer);
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
                        const rx = new RegExp(`${node.type}\\(${node.id}.*\\)`, "gm");

                        if (!rx.test(datalog)) {
                            missing.add(node);
                        }
                    });
                }

                sol.assert(missing.size === 0, `Missing nodes {0}`, missing);
            });

            it("each AST node has a src fact", () => {
                const missing = new Set<sol.ASTNode>();

                for (const unit of units) {
                    unit.walk((node) => {
                        const rx = new RegExp(`src\\(${node.id}, "${node.src}"\\)`, "gm");

                        if (!rx.test(datalog)) {
                            missing.add(node);
                        }
                    });
                }

                sol.assert(missing.size === 0, `Missing srcs for nodes {0}`, missing);
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
