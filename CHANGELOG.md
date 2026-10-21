# Changelog

All notable changes to this project are documented here.
Versions before `11.0.0` are listed in the [git tags](https://github.com/Shuunen/shuutils/tags).

## 11.1.0

### Fixed in 11.1.0

- `isDevEnvironment` and `isDeployedInDevNamespace` threw a `TypeError` when called without arguments from the cjs bundle, where `import.meta.env` does not exist

### Changed in 11.1.0

- Zero runtime dependencies, the clis use the native `fs.glob` instead of `tiny-glob`
- `unique-mark` accepts plain globs like `*.js`, the `*.{js}` form still works
- The package now requires Node `>=22.2.0` through `engines`, needed by the clis
- The package declares `"sideEffects": false` so bundlers can drop unused modules
- The build moved from tsup to tsdown and TypeScript 7, the bundles keep their JSDoc comments and the typings list the same exports

## 11.0.0

### Breaking in 11.0.0

- Removed the top-level `ok`, `err`, `unwrap` and `trySafe` exports, use `Result.ok`, `Result.err`, `Result.unwrap` and `Result.trySafe`
- Removed `expectType` and `expectEqualTypes`, use your test runner's own type assertions
- Removed `cn`, `genClass`, `access` and `jsonStartRegex`
- `sanitize` and `slugify` now treat `.` as a separator, so `slugify('example.com')` returns `example-com` where `v10` returned `examplecom`

### Fixed in 11.0.0

- `crc32` returned a negative number for about half of its inputs, which also affected `stringSum` and `objectSum`, the results are back to the `v10` values
- The published `unique-mark` bin did nothing, the cjs bundle never reached its entry point
- `alignForSnap` threw a `ReferenceError` when used outside a DOM environment
- The package shipped without a `types` field nor exports conditions, so `node16` and `nodenext` consumers got no typings
- `dist` is now built on `prepack`, so publishing cannot ship a stale bundle

### Changed in 11.0.0

- The whole library is split into one module per file under `src/lib`, with a generated barrel
- The toolchain moved to pnpm, turbo, vitest, oxlint, oxfmt, tsup and tsgo
- `header-injector` takes a `--target` glob and defaults to `src/**/*.ts` instead of walking the whole working directory
