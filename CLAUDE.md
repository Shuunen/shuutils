# CLAUDE

## Project

`shuutils` is a published npm library of near-zero-dependency TypeScript utilities. No app, no framework, no UI.

- `src/lib/*.ts` — the utilities, one module per file, each with a sibling `.test.ts`
- `src/index.ts` — generated barrel, run `pnpm run list` to regenerate it
- `src/plugins/*.ts` — the `shuutils/plugins` entry (the `uniqueMark` bundler plugin), built to `dist/plugins.js`
- `src/bin/*.cli.ts` — CLIs (custom linter, barrel maker, changelog, header injector, `unique-mark`)

## After any codebase change

Run `pnpm check` (types, formatting, lint, custom lint, package shape, builds, tests). Fix all failures before done.

## Linting rules

Never disable a lint rule without asking the user. Try to fix the code first then if too complex, ask the user if they want to disable the rule for that line/file.

`pnpm run lint:repo` runs the repo's own rules (see `src/bin/repo-lint.rules.ts`):
lib modules need a sibling test, exports need JSDoc, the barrel must be up to date,
lib modules must not call `console` nor import from a parent directory.

## Versioning

`VERSION` holds the version as MAJOR.MINOR.PATCH semver, and must stay in sync with `version` in `package.json`. Bump both in the same commit.

To release, update `CHANGELOG.md` then run `npm version <major|minor|patch>` : it runs `pnpm check`, syncs `VERSION`, commits and pushes, without a tag. On master, the `release` workflow sees the untagged version, publishes it to npm with provenance through trusted publishing, then pushes the `vX.Y.Z` tag. Never publish nor push a version tag from a local machine.

## Code practices

- **Zero deps**: never add a runtime dependency, inline the few lines instead
- **Constants**: camelCase only, never UPPER_SNAKE_CASE
- **Declarations**: one variable per `const` / `let` statement, never `const a = 1, b = 2` (enforced by `one-var: never`)
- **Absent values**: `undefined`, never `null`; use `isNil` from `./is-nil.ts` to check
- **Narrowing**: use `invariant(x, "msg")` from `./invariant.ts` — never `x!` or silent `if (!x) return`
- **Imports**: relative imports always carry the `.ts` extension, like `from './is-nil.ts'` (enforced by `moduleResolution: nodenext` and `import/extensions`), so Node's native type stripping can load `src` directly, for example from `tsdown.config.ts`

## Testing practices

- **Globals**: `describe`, `it`, `expect` are global — do not import them
- **File naming**: `.test.ts` only, never `.spec.ts`
- **Structure**: wrap the tests of a file in a top-level `describe('<module-name>', ...)` and write each case with `it(...)` (enforced by `require-top-level-describe` and `consistent-test-it`)
- **Spacing in tests**: inside `it` blocks, do not include empty lines for visual spacing, but do leave one empty line between consecutive `it` blocks
- **DOM tests**: register happy-dom per file with `GlobalRegistrator.register({ url: 'https://localhost/' })`
- **Fail loudly**: pair `expect(x).toBeDefined()` with `invariant(x, "msg")` — never `if (!x) return`
- **Type checks**: `toBeTypeOf("number")` over `expect(typeof x).toBe("number")`
