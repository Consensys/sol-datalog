import expect from "expect";
import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import { OutputRelations, analyze } from "../src";
import { searchRecursive } from "../src/lib/utils";
import * as dl from "souffle.ts";
import { join } from "path";

const samples = searchRecursive("test/samples/analyses", (fileName) => fileName.endsWith(".json"));

const MY_DIR = __dirname;
const DIST_SO_DIR = join(MY_DIR, "../dist/functors");

/**
 * Sanitize the facts for a given relation by converting all non-primitive columns to null.
 * We do this before comparing, since some path facts may be non-deterministic.
 */
function sanitize(relation: dl.Relation, facts: any[][]): any[][] {
    const nonPrimitiveFieldIdxs: Set<number> = new Set(
        relation.fields
            .map(([, type], i) => [type, i] as [dl.DatalogType, number])
            .filter(([type]) => !dl.isPrimitiveType(type))
            .map(([, idx]) => idx)
    );

    return facts.map((values) =>
        values.map((v, idx) => (nonPrimitiveFieldIdxs.has(idx) ? null : v))
    );
}

describe("Analyses", () => {
    for (const json of samples) {
        const sample = json.replace(".json", ".sol");

        describe(sample, () => {
            let units: sol.SourceUnit[];
            let expectedOutput: OutputRelations;
            let reader: sol.ASTReader;
            let version: string;

            before(async () => {
                reader = new sol.ASTReader();
                const result = await sol.compileSol(sample, "auto");

                const data = result.data;
                const errors = sol.detectCompileErrors(data);

                expect(errors).toHaveLength(0);
                version = result.compilerVersion as string;

                units = reader.read(data);

                expect(units.length).toBeGreaterThanOrEqual(1);

                expectedOutput = fse.readJSONSync(json, {
                    encoding: "utf-8"
                }) as OutputRelations;
            });

            it("Detectors produce expected results", async () => {
                const targetAnalyses = [...Object.keys(expectedOutput)];
                const infer = new sol.InferType(version);
                const instance = (await analyze(
                    units,
                    infer,
                    "csv",
                    targetAnalyses,
                    DIST_SO_DIR
                )) as dl.SouffleCSVInstance;
                const analysisResults = await instance.allFacts();
                instance.release();

                for (const [key, val] of Object.entries(expectedOutput)) {
                    const relation = instance.relation(key);
                    const received = sanitize(
                        relation,
                        (analysisResults.get(key) as dl.Fact[]).map((fact) => fact.toJSON())
                    );
                    const expected = sanitize(relation, val);

                    expect(received).toEqual(expected);
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
        let reader: sol.ASTReader;
        let version: string;

        before(async () => {
            reader = new sol.ASTReader();
            const result = await sol.compileSol(sample, "auto");

            const data = result.data;
            const errors = sol.detectCompileErrors(data);

            expect(errors).toHaveLength(0);

            version = result.compilerVersion as string;
            units = reader.read(data);

            expect(units.length).toBeGreaterThanOrEqual(1);

            expectedOutput = fse.readJSONSync(json, {
                encoding: "utf-8"
            }) as OutputRelations;
        });

        it("Detectors produce expected results", async () => {
            const targetAnalyses = [...Object.keys(expectedOutput)];
            const infer = new sol.InferType(version);
            const instance = (await analyze(
                units,
                infer,
                "sqlite",
                targetAnalyses
            )) as dl.SouffleSQLiteInstance;

            for (const [key, val] of Object.entries(expectedOutput)) {
                const actualResutls = (await instance.relationFacts(key)).map((f) => f.fields);
                expect(actualResutls).toEqual(val);
            }

            instance.release();
        });
    });
});
