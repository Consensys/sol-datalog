import expect from "expect";
import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import { OutputRelations, analyze } from "../src";
import { Fact, searchRecursive } from "../src/lib/utils";
import * as dl from "souffle.ts";

const samples = searchRecursive("test/samples/analyses", (fileName) => fileName.endsWith(".json"));

interface AnalysesTest {
    [relation: string]: {
        fmt: string;
        data: string[];
    };
}
/**
 * Remove duplicate rows.
 */
function dedup(facts: any[][]): any[][] {
    const m = new Map<string, any[]>(facts.map((row) => [dl.pp(row), row]));

    return [...m.values()];
}

/**
 * Sanitize the facts for a given relation by converting all non-primitive
 * columns to null and removing duplicate rows.
 *
 * We do this before comparing, since some path facts may be non-deterministic.
 */
export function sanitize(relation: dl.Relation, facts: any[][]): any[][] {
    const nonPrimitiveFieldIdxs: Set<number> = new Set(
        relation.fields
            .map(([, type], i) => [type, i] as [dl.DatalogType, number])
            .filter(([type]) => !dl.isPrimitiveType(type))
            .map(([, idx]) => idx)
    );

    return dedup(
        facts.map((values) => values.map((v, idx) => (nonPrimitiveFieldIdxs.has(idx) ? null : v)))
    );
}

describe("Analyses", () => {
    for (const json of samples) {
        const sample = json.replace(".json", ".sol");

        describe(sample, () => {
            let units: sol.SourceUnit[];
            let expectedOutput: AnalysesTest;
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
                }) as AnalysesTest;
            });

            it("Detectors produce expected results", async () => {
                const targetAnalyses = [...Object.keys(expectedOutput)];
                const infer = new sol.InferType(version);
                const instance = (await analyze(
                    units,
                    infer,
                    "csv",
                    targetAnalyses
                )) as dl.SouffleCSVInstance;
                const analysisResults = await instance.allFacts();
                instance.release();

                for (const [key, val] of Object.entries(expectedOutput)) {
                    const received = (analysisResults.get(key) as dl.Fact[]).map((f) =>
                        new Fact(f, reader.context).fmt(val.fmt)
                    );

                    expect(received).toEqual(val.data);
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
                const received = (await instance.relationFacts(key)).map((f) =>
                    new Fact(f, reader.context).fmt(val.fmt)
                );

                expect(received).toEqual(val.data);
            }

            instance.release();
        });
    });
});
