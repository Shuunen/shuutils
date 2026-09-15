# TODO

## Migrate the build from tsup to tsdown

`tsdown` is the rolldown-based successor of `tsup`, same config shape, and it aligns with the
rolldown-flavoured vite used in the `recipes` reference stack.

- [ ] `pnpm remove tsup && pnpm add -D tsdown`
- [ ] Rename `tsup.config.ts` to `tsdown.config.ts`, swap `defineConfig` import to `tsdown`
- [ ] Update `package.json` script `build:tsup` → `build:tsdown` (`tsdown`, there is no `tsup-node` equivalent)
- [ ] Update the matching task name and `dependsOn` in `turbo.json`, and the `check` script task list
- [ ] Check `dts` options still apply — tsdown uses `rolldown-plugin-dts`, `compilerOptions` may need reshaping (currently `ignoreDeprecations: '6.0'` + `types: ['node', 'vite/client']`)
- [ ] Check the two-entry setup still works: ESM+CJS `shuutils` bundle, and the CJS-only `unique-mark` bin with its shebang banner
- [ ] Verify `dist/` output sizes and that `dist/shuutils.d.ts` is still complete
- [ ] Update `tsconfig.node.json` include and `.oxlintrc.json` / `vite.config.ts` coverage excludes that mention `tsup.config.ts`
