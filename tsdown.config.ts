import { defineConfig } from 'tsdown'

const banner = '// shuutils __unique-mark__\n'
const shebang = '#!/usr/bin/env node\n'

// oxlint-disable-next-line import/no-default-export
export default defineConfig([
  {
    banner: { js: banner },
    clean: true,
    dts: { compilerOptions: { types: ['node', 'vite/client'] } },
    // the root tsconfig.json is a solution file with no files, the dts generator needs the real project
    tsconfig: 'tsconfig.app.json',
    entry: { shuutils: 'src/index.ts' },
    // keep the .js / .cjs / .d.ts / .d.cts names that package.json exports point to
    fixedExtension: false,
    format: ['esm', 'cjs'],
    minify: false,
    sourcemap: false,
    treeshake: true,
  },
  {
    banner: { js: shebang + banner },
    clean: false,
    // the cjs output rewrites import.meta to {}, so the bin entry would never self-start
    define: { 'import.meta.main': 'true' },
    dts: false,
    entry: { 'unique-mark': 'src/bin/unique-mark.cli.ts' },
    fixedExtension: false,
    format: ['cjs'],
    minify: false,
    sourcemap: false,
    treeshake: true,
  },
  {
    banner: { js: shebang + banner },
    clean: false,
    // esm only, these clis rely on import.meta.main and top level await, which cjs cannot express
    dts: false,
    entry: { 'barrel-maker': 'src/bin/barrel-maker.cli.ts', 'changelog-generator': 'src/bin/changelog-generator.cli.ts', 'header-injector': 'src/bin/header-injector.cli.ts', 'repo-lint': 'src/bin/repo-lint.cli.ts' },
    fixedExtension: false,
    format: ['esm'],
    minify: false,
    sourcemap: false,
    treeshake: true,
  },
])
