# sol-datalog

Package provides encoding from the [solc-typed-ast](https://github.com/ConsenSys/solc-typed-ast) into datalog.

## Installation

1. Preinstall NodeJS of [compatible version](/.nvmrc). If there is a need to run different NodeJS versions, consider using [NVM](https://github.com/nvm-sh/nvm) or similar tool for your platform.
2. Install [Soufflé](https://souffle-lang.github.io/).
3. Clone https://github.com/ConsenSys/solc-typed-ast to standalone directory.
4. Clone this repostory.
5. Copy `.env.example` to `.env` file. Set value for `SOLC_TYPED_AST_DIR` to a directory path from step 2.
6. Run `npm install`.
7. Run `npm link`.

## Usage

Produce Datalog from Solidity source:

```bash
sol-datalog-cli sample.sol --dump

# Consider redirecting output to a file (useful when there is a need to look through emitted code regularly)
sol-datalog-cli sample.sol --dump > sample.dl
```

Run predefined detectors:

```bash
sol-datalog-cli test/samples/detectors/msgSenderInconsistency.sol --run-detectors
```

Start a light-weight server for interactive mode. Interactive mode also allows to inject Datalog facts and relations, then run custom analyses.

```bash
sol-datalog-cli sample.sol --code-search
# Then open http://localhost:3000/ in browser

SERVER_PORT=8080 sol-datalog-cli sample.sol --code-search
# Then open http://localhost:8080/ in browser
```

In **Datalog query** section of UI, try to output something with `.output ContractDefinition` and clicking on <kbd>Run</kbd> button. Read more about Datalog and Soufflé in the [related documentation](https://souffle-lang.github.io/program).

See other options by running `--help`.
