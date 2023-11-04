#!/usr/bin/env node
import minimist from "minimist";
import * as sol from "solc-typed-ast";
import { preamble, translate } from "../lib";

const helpMessage = `Utility for converting solidity files into datalog
USAGE:

$ sol-datalog <filename>

OPTIONS:
    --help                  Print help message.
    --version               Print package version.
`;

const cli = {
    boolean: ["version", "help"],
    default: {}
};

function terminate(message?: string, exitCode = 0): never {
    if (message !== undefined) {
        if (exitCode === 0) {
            console.log(message);
        } else {
            console.error(message);
        }
    }

    process.exit(exitCode);
}

function error(message: string): never {
    terminate(message, 1);
}

(async () => {
    const args = minimist(process.argv.slice(2), cli);

    if (args.version) {
        const { version } = require("../../package.json");

        terminate(version);
    }

    if (args.help) {
        terminate(helpMessage);
    }

    let result: sol.CompileResult;

    if (args._.length !== 1) {
        terminate("Specify single file name to process");
    }

    const fileName: string = args._[0];

    try {
        console.error(fileName);
        result = await sol.compileSol(fileName, "auto");
    } catch (e) {
        terminate(`Exception during compilation ` + e);
    }

    const reader = new sol.ASTReader();
    const units = reader.read(result.data);

    const datalogProg = translate(units);
    console.log(preamble + datalogProg);
})().catch((e) => {
    error(e.message);
});
