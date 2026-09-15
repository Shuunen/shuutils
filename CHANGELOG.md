# Changelog

All notable changes to this project are documented here.
Versions before `11.0.0` are listed in the [git tags](https://github.com/Shuunen/shuutils/tags).

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
