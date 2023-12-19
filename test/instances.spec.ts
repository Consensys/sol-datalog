import expect from "expect";
import * as sol from "solc-typed-ast";
import { buildDatalog } from "../src";
import {
    SouffleCSVInstance,
    SouffleCSVToSQLInstance,
    SouffleInstanceI
} from "../src/lib/souffle/instance";
import { join } from "path";

const MY_DIR = __dirname;
const DIST_SO_DIR = join(MY_DIR, "../dist/functors");

describe("Instances have equivalent behavior", () => {
    const samples: Array<[string, string[]]> = [["test/samples/analyses/fcall.sol", ["callsPath"]]];
    // The SouffleSQLiteInstance doesnt work on record types due to
    const instances = [SouffleCSVInstance /*SouffleSQLiteInstance,*/, SouffleCSVToSQLInstance];

    for (const [sample, analyses] of samples) {
        describe(sample, () => {
            let units: sol.SourceUnit[];
            let datalog: string;
            let reader: sol.ASTReader;
            let version: string;
            let firstInstance: SouffleInstanceI;

            before(async () => {
                reader = new sol.ASTReader();
                const result = await sol.compileSol(sample, "auto");

                const data = result.data;
                const errors = sol.detectCompileErrors(data);

                expect(errors).toHaveLength(0);
                version = result.compilerVersion as string;

                units = reader.read(data);

                expect(units.length).toBeGreaterThanOrEqual(1);

                const infer = new sol.InferType(version);
                datalog = buildDatalog(units, infer);

                firstInstance = new instances[0](datalog, DIST_SO_DIR);
                await firstInstance.run(analyses);
            });

            for (let i = 1; i < instances.length; i++) {
                it(`Instance ${instances[0].name} and ${instances[i].name} produce the same results`, async () => {
                    const otherInstance = new instances[i](datalog, DIST_SO_DIR);

                    await otherInstance.run(analyses);

                    for (const analysis of analyses) {
                        const firstInstResult = (await firstInstance.relationFacts(analysis)).map(
                            (fact) => fact.toJSON()
                        );
                        const otherInstResult = (await otherInstance.relationFacts(analysis)).map(
                            (fact) => fact.toJSON()
                        );

                        expect(firstInstResult.length > 0).toBeTruthy();
                        expect(firstInstResult).toEqual(otherInstResult);
                    }
                });
            }
        });
    }
});
