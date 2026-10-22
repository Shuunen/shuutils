import { defineConfig, type UserConfig } from 'tsdown'
import { uniqueMark } from './src/plugins/unique-mark.ts'

const shebang = '#!/usr/bin/env node\n'

const base = {
  // keep the .js / .d.ts names that package.json exports point to
  fixedExtension: false,
  format: ['esm'],
  minify: false,
  sourcemap: false,
  treeshake: true,
} satisfies UserConfig

// each config gets its own uniqueMark instance, the plugin keeps the resolved root per instance
// oxlint-disable-next-line import/no-default-export
export default defineConfig([
  {
    ...base,
    clean: true,
    dts: { compilerOptions: { types: ['node', 'vite/client'] } },
    entry: { shuutils: 'src/index.ts' },
    plugins: [uniqueMark()],
    // the root tsconfig.json is a solution file with no files, the dts generator needs the real project
    tsconfig: 'tsconfig.app.json',
  },
  {
    ...base,
    clean: false,
    dts: { compilerOptions: { types: ['node'] } },
    entry: { plugins: 'src/plugins/index.ts' },
    plugins: [uniqueMark()],
    tsconfig: 'tsconfig.app.json',
  },
  {
    ...base,
    banner: { js: shebang },
    clean: false,
    // these files only run as bins, and import.meta.main is missing on older node 22 releases
    define: { 'import.meta.main': 'true' },
    dts: false,
    entry: {
      'barrel-maker': 'src/bin/barrel-maker.cli.ts',
      'changelog-generator': 'src/bin/changelog-generator.cli.ts',
      'header-injector': 'src/bin/header-injector.cli.ts',
      'repo-lint': 'src/bin/repo-lint.cli.ts',
      'unique-mark': 'src/bin/unique-mark.cli.ts',
    },
    plugins: [uniqueMark()],
  },
])
