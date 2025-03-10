
# Benchmarks

## Eslint

`hyperfine --runs 5 --warmup 1 'node node_modules/eslint/bin/eslint'`

| date       | delay   | comment                           | node  | machine    |
| ---------- | ------- | --------------------------------- | :---: | ---------- |
| 2023-02-09 | 19 sec  |                                   |       |            |
| 2023-04-05 | 13 sec  | nice improvement, no idea why ^^' |       |            |
| 2023-12-11 | 13 sec  | stable                            |  20   | NZXL Win11 |
| 2024-06-29 | 7,6 sec | 2x faster with Duc ? *doubt*      |  20   | Duc Win11  |
| 2024-06-30 | 4,5 sec | 2x faster with eslint-pg-shuunen  |  20   | Duc Win11  |
| 2024-07-07 | 6,5 sec | eslint-plugin-shuunen 0.1         |  20   | Gram Zorin |
| 2024-07-08 | 6,4 sec | eslint-plugin-shuunen 0.2         |  20   | Gram Zorin |
| 2025-03-09 | 5,0 sec | eslint-plugin-shuunen 1.0.2       |  23   | Duc Win11  |

## Others

| date       | command alias | delay   | comment                           | machine            |
| ---------- | ------------- | ------- | --------------------------------- | ------------------ |
| 2023-02-09 | build         | 145 ms  |                                   |                    |
| 2023-02-09 | c8-uvu        | 3,5 sec | 900 ms for coverage               |                    |
| 2023-02-09 | tsc-no-emit   | 1,6 sec |                                   |                    |
| 2023-02-09 | uvu           | 2,6 sec |                                   |                    |
| 2023-02-09 | uvu-happy-dom | 1,7 sec | happy was imported in dom.test.ts |                    |
| 2023-02-11 | c8-vitest     | 5,3 sec | 1,5 sec for coverage              |                    |
| 2023-02-11 | vitest        | 3,8 sec |                                   |                    |
| 2023-04-05 | build         | 130 ms  | stable, small improvement         |                    |
| 2023-04-05 | c8-vitest     | 4,0 sec | nice improvement, no idea why ^^' |                    |
| 2023-04-05 | tsc-no-emit   | 1,7 sec | maybe typescript 5 bump           |                    |
| 2023-04-05 | vitest        | 3,7 sec | stable                            |                    |
| 2023-12-11 | build         | 202 ms  | que paso ?!?                      | NZXL Win11 Node 20 |
| 2023-12-11 | tsc-no-emit   | 2,5 sec | que paso ?!?                      | NZXL Win11 Node 20 |
| 2023-12-11 | vitest        | 5,7 sec | que paso ?!?                      | NZXL Win11 Node 20 |
| 2024-06-29 | build         | 1,8 sec | new build via pkgroll             | Duc Win11 Node 20  |
| 2024-06-29 | c8-vitest     | 3,0 sec | seems ISO with better hardware    | Duc Win11 Node 20  |
| 2024-06-29 | tsc-no-emit   | 1,2 sec | seems ISO with better hardware    | Duc Win11 Node 20  |
| 2024-06-29 | vitest        | 2,5 sec | seems ISO with better hardware    | Duc Win11 Node 20  |

Command aliases :

- build (deprecated since 06/2024) : `hyperfine --runs 20 --warmup 3 'node bin/build'`
- build : `hyperfine --runs 20 --warmup 3 'npx pkgroll --target=esnext'`
- tsc-no-emit : `hyperfine --runs 5 --warmup 3 'node node_modules/typescript/bin/tsc --noEmit'`
- uvu : `hyperfine --runs 10 --warmup 3 'node node_modules/uvu/bin -r tsm -r jsdom-global/register tests'`
- uvu-happy-dom : `hyperfine --runs 10 --warmup 3 'node node_modules/uvu/bin -r tsm tests'`
- c8-uvu : `hyperfine --runs 10 --warmup 3 'node node_modules/c8/bin/c8 node_modules/uvu/bin -r tsm -r jsdom-global/register tests'`
- vitest : `hyperfine --runs 10 --warmup 3 'npx vitest --run'`
- c8-vitest : `hyperfine --runs 10 --warmup 3 'npx vitest --coverage --run'`
