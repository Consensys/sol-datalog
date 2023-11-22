import expect from "expect";
import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import { OutputRelations, analyze } from "../src";
import { searchRecursive } from "../src/lib/utils";

const samples = searchRecursive("test/samples/analyses", (fileName) => fileName.endsWith(".json"));

describe("Analyses", () => {
    for (const json of samples) {
        const sample = json.replace(".json", ".sol");

        describe(sample, () => {
            let units: sol.SourceUnit[];
            let expectedOutput: OutputRelations;

            before(async () => {
                const result = await sol.compileSol(sample, "auto");

                const data = result.data;
                const errors = sol.detectCompileErrors(data);

                expect(errors).toHaveLength(0);

                units = new sol.ASTReader().read(data);

                expect(units.length).toBeGreaterThanOrEqual(1);

                expectedOutput = fse.readJSONSync(json, { encoding: "utf-8" });
            });

            it("Detectors produce expected results", async () => {
                const targetAnalyses = [...Object.keys(expectedOutput)];
                const addtionalDL = targetAnalyses.map((x: string) => `.output ${x}`).join("\n");

                const analysisResults = await analyze(units, addtionalDL);

                for (const [key, val] of Object.entries(expectedOutput)) {
                    expect(analysisResults.get(key)).toEqual(val);
                }
            });
        });
    }
});
