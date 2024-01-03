import expect from "expect";
import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import { OutputRelations, analyze } from "../src";
import { searchRecursive } from "../src/lib/utils";
import { SouffleCSVInstance, SouffleSQLiteInstance } from "../src/lib/souffle/instance";
import { Fact } from "../src/lib/souffle/fact";
import { join } from "path";

const samples = searchRecursive("test/samples/analyses", (fileName) => fileName.endsWith(".json"));

const MY_DIR = __dirname;
const DIST_SO_DIR = join(MY_DIR, "../dist/functors");

describe("Analyses", () => {
    for (const json of samples) {
        const sample = json.replace(".json", ".sol");

        describe(sample, () => {
            let units: sol.SourceUnit[];
            let expectedOutput: OutputRelations;
            let version: string;

            before(async () => {
                const result = await sol.compileSol(sample, "auto");

                const data = result.data;
                const errors = sol.detectCompileErrors(data);

                expect(errors).toHaveLength(0);

                version = result.compilerVersion as string;

                units = new sol.ASTReader().read(data);

                expect(units.length).toBeGreaterThanOrEqual(1);

                expectedOutput = fse.readJSONSync(json, { encoding: "utf-8" });
            });

            it("Analyses produce expected results", async () => {
                const targetAnalyses = [...Object.keys(expectedOutput)];
                const infer = new sol.InferType(version);
                const instance = (await analyze(
                    units,
                    infer,
                    "csv",
                    targetAnalyses,
                    DIST_SO_DIR
                )) as SouffleCSVInstance;

                const analysisResults = instance.results();

                instance.release();

                // await fse.writeFile(
                //     json,
                //     JSON.stringify(Object.fromEntries(analysisResults.entries()), undefined, 4)
                // );

                for (const [key, val] of Object.entries(expectedOutput)) {
                    expect(
                        (analysisResults.get(key) as Fact[]).map((fact) => fact.toJSON())
                    ).toEqual(val);
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
        let version: string;

        before(async () => {
            const result = await sol.compileSol(sample, "auto");

            const data = result.data;
            const errors = sol.detectCompileErrors(data);

            expect(errors).toHaveLength(0);

            version = result.compilerVersion as string;
            units = new sol.ASTReader().read(data);

            expect(units.length).toBeGreaterThanOrEqual(1);

            expectedOutput = fse.readJSONSync(json, {
                encoding: "utf-8"
            }) as OutputRelations;
        });

        it("Analyses produce expected results", async () => {
            const targetAnalyses = [...Object.keys(expectedOutput)];
            const infer = new sol.InferType(version);
            const instance = (await analyze(
                units,
                infer,
                "sqlite",
                targetAnalyses
            )) as SouffleSQLiteInstance;

            for (const [key, val] of Object.entries(expectedOutput)) {
                const actualResutls = (await instance.relationFacts(key)).map((f) => f.fields);

                expect(actualResutls).toEqual(val);
            }

            instance.release();
        });
    });
});
