
# Benchmarks

| command alias | date       | delay   | comment                           |
| ------------- | ---------- | ------- | --------------------------------- |
| build         | 2023-04-05 | 130 ms  | stable, small improvement         |
| tsc-no-emit   | 2023-04-05 | 1,7 sec | maybe typescript 5 bump           |
| eslint        | 2023-04-05 | 13 sec  | nice improvement, no idea why ^^' |
| vitest        | 2023-04-05 | 3,7 sec | stable                            |
| c8-vitest     | 2023-04-05 | 4,0 sec | nice improvement, no idea why ^^' |
| build         | 2023-02-09 | 145 ms  |                                   |
| tsc-no-emit   | 2023-02-09 | 1,6 sec |                                   |
| eslint        | 2023-02-09 | 19 sec  |                                   |
| uvu           | 2023-02-09 | 2,6 sec |                                   |
| uvu-happy-dom | 2023-02-09 | 1,7 sec | happy was imported in dom.test.ts |
| c8-uvu        | 2023-02-09 | 3,5 sec | 900 ms for coverage               |
| vitest        | 2023-02-11 | 3,8 sec |                                   |
| c8-vitest     | 2023-02-11 | 5,3 sec | 1,5 sec for coverage              |

Command aliases :

- build : `hyperfine --runs 20 --warmup 3 'node bin/build'`
- tsc-no-emit : `hyperfine --runs 5 --warmup 3 'node node_modules/typescript/bin/tsc --noEmit'`
- eslint : `hyperfine --runs 5 --warmup 3 'node node_modules/eslint/bin/eslint --fix --ignore-path .gitignore --ext .js,.ts .'`
- uvu : `hyperfine --runs 10 --warmup 3 'node node_modules/uvu/bin -r tsm -r jsdom-global/register tests'`
- uvu-happy-dom : `hyperfine --runs 10 --warmup 3 'node node_modules/uvu/bin -r tsm tests'`
- c8-uvu : `hyperfine --runs 10 --warmup 3 'node node_modules/c8/bin/c8 node_modules/uvu/bin -r tsm -r jsdom-global/register tests'`
- vitest : `hyperfine --runs 10 --warmup 3 'npx vitest --run'`
- c8-vitest : `hyperfine --runs 10 --warmup 3 'npx vitest --coverage --run'`
