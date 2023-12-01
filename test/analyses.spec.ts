import expect from "expect";
import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import { OutputRelations, analyze } from "../src";
import { searchRecursive } from "../src/lib/utils";
import { SouffleCSVInstance, SouffleSQLiteInstance } from "../src/lib/souffle/instance";

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

            it("Analyses produce expected results", async () => {
                const targetAnalyses = [...Object.keys(expectedOutput)];
                const instance = (await analyze(
                    units,
                    "csv",
                    targetAnalyses
                )) as SouffleCSVInstance;

                const analysisResults = instance.results();

                instance.release();

                // console.log(JSON.stringify(Object.fromEntries(analysisResults.entries())));

                for (const [key, val] of Object.entries(expectedOutput)) {
                    expect(analysisResults.get(key)).toEqual(val);
                }
            });
        });
    }
});

describe("Analyses work in sqlite mode", () => {
    const json = samples[0];
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

            expectedOutput = fse.readJSONSync(json, {
                encoding: "utf-8"
            }) as OutputRelations;
        });

        it("Analyses produce expected results", async () => {
            const targetAnalyses = [...Object.keys(expectedOutput)];
            const instance = (await analyze(
                units,
                "sqlite",
                targetAnalyses
            )) as SouffleSQLiteInstance;

            for (const [key, val] of Object.entries(expectedOutput)) {
                const actualResutls = (await instance.getRelation(key)).map((f) => f.fields);

                expect(actualResutls).toEqual(val);
            }

            instance.release();
        });
    });
});
