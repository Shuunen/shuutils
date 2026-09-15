import { defineConfig } from 'tsup'

const banner = '// shuutils __unique-mark__\n',
  shebang = '#!/usr/bin/env node\n'

// oxlint-disable-next-line import/no-default-export
export default defineConfig([
  {
    banner: { js: banner },
    clean: true,
    dts: { compilerOptions: { ignoreDeprecations: '6.0', types: ['node', 'vite/client'] } },
    entry: { shuutils: 'src/index.ts' },
    format: ['esm', 'cjs'],
    minify: false,
    sourcemap: false,
    treeshake: true,
  },
  {
    banner: { js: shebang + banner },
    clean: false,
    // esbuild rewrites import.meta to {} in cjs, so the bin entry would never self-start
    define: { 'import.meta.main': 'true' },
    dts: false,
    entry: { 'unique-mark': 'src/bin/unique-mark.cli.ts' },
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
    format: ['esm'],
    minify: false,
    sourcemap: false,
    treeshake: true,
  },
])
