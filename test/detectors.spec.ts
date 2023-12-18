import expect from "expect";
import fse from "fs-extra";
import * as sol from "solc-typed-ast";
import { Issue, detect } from "../src";
import { searchRecursive } from "../src/lib/utils";

const samples = searchRecursive("test/samples/detectors", (fileName) => fileName.endsWith(".sol"));

describe("Detectors", () => {
    for (const sample of samples) {
        describe(sample, () => {
            let units: sol.SourceUnit[];
            let expectedIssues: Issue[];
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

                expectedIssues = fse.readJSONSync(sample.replace(".sol", ".json"), {
                    encoding: "utf-8"
                }) as Issue[];
            });

            it("Detectors produce expected results", async () => {
                const infer = new sol.InferType(version);
                const actualIssues = await detect(units, reader.context, infer);
                expect(actualIssues).toEqual(expectedIssues);
            });
        });
    }
});
