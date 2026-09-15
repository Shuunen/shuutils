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
    dts: false,
    entry: { 'unique-mark': 'src/bin/unique-mark.cli.ts' },
    format: ['cjs'],
    minify: false,
    sourcemap: false,
    treeshake: true,
  },
])
