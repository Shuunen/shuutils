# CLAUDE

## Project

`shuutils` is a published npm library of near-zero-dependency TypeScript utilities. No app, no framework, no UI.

- `src/lib/*.ts` — the utilities, one module per file, each with a sibling `.test.ts`
- `src/index.ts` — generated barrel, run `pnpm run list` to regenerate it
- `src/bin/*.cli.ts` — internal CLIs (custom linter, barrel maker, changelog, `unique-mark`)

## After any codebase change

Run `pnpm check` (types, formatting, lint, custom lint, builds, tests). Fix all failures before done.

## Linting rules

Never disable a lint rule without asking the user. Try to fix the code first then if too complex, ask the user if they want to disable the rule for that line/file.

`pnpm run lint:shuutils` runs the repo's own rules (see `src/bin/lint.rules.ts`):
lib modules need a sibling test, exports need JSDoc, the barrel must be up to date,
lib modules must not call `console` nor import from a parent directory.

## Code practices

- **Zero deps**: never add a runtime dependency, inline the few lines instead
- **Constants**: camelCase only, never UPPER_SNAKE_CASE
- **Absent values**: `undefined`, never `null`; use `isNil` from `./is-nil` to check
- **Narrowing**: use `invariant(x, "msg")` from `./invariant` — never `x!` or silent `if (!x) return`
- **Imports**: extensionless relative imports (`moduleResolution: bundler`)

## Testing practices

- **Globals**: `describe`, `it`, `expect` are global — do not import them
- **File naming**: `.test.ts` only, never `.spec.ts`
- **Spacing in tests**: inside `test`/`it` blocks, do not include empty lines for visual spacing
- **DOM tests**: register happy-dom per file with `GlobalRegistrator.register({ url: 'https://localhost/' })`
- **Fail loudly**: pair `expect(x).toBeDefined()` with `invariant(x, "msg")` — never `if (!x) return`
- **Type checks**: `toBeTypeOf("number")` over `expect(typeof x).toBe("number")`
