# TODO

## Review follow-ups from the monorepo split

Behaviors that changed during the split and still need a decision, reverting or a migration note :

- [ ] `parseJson` returns a different shape than `v10`, check callers and document it
- [ ] `isRecord` now accepts functions, `Map`, `Set`, `Date` and class instances, which changes deep-merge results
- [ ] `Logger` persistence rewrites the whole file on each line, fine for small logs only
- [ ] Lost generics on `findOne`, `on` and `throttle`, callers get widened types
- [ ] `readClipboard` parameter and `isBrowserEnvironment` headless detection differ from `v10`
- [ ] `src/bin/repo-lint.rules.ts` is excluded from coverage although `repo-lint.rules.test.ts` exists
