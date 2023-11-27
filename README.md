# sol-datalog

Package provides encoding from the [solc-typed-ast](https://github.com/ConsenSys/solc-typed-ast) into datalog.

## Installation

1. Preinstall NodeJS of [compatible version](/.nvmrc). If there is a need to run different NodeJS versions, consider using [NVM](https://github.com/nvm-sh/nvm) or similar tool for your platform.
2. Clone https://github.com/ConsenSys/solc-typed-ast to standalone directory.
3. Clone this repostory.
4. Copy `.env.example` to `.env` file. Set value for `SOLC_TYPED_AST_DIR` to a directory path from step 2.
5. Run `npm install`.
6. Run `npm link`.

## Usage

Produce Datalog from Solidity source:

```bash
sol-datalog-cli sample.sol --dump
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

See other options by running `--help`.
