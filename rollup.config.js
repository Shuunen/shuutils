/* eslint-disable @typescript-eslint/naming-convention */
import typescript from '@rollup/plugin-typescript'

const banner = '// shuutils __unique-mark__\n'

const shebang = '#!/usr/bin/env node\n'

const plugins = [
  typescript({
    tsconfig: './tsconfig.json',
  }),
]

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        banner,
        file: 'dist/shuutils.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        banner,
        file: 'dist/shuutils.esm.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins,
  },
  {
    external: ['node:child_process', 'node:fs', 'node:path', 'tiny-glob'],
    input: 'src/unique-mark.ts',
    output: [
      {
        banner: `${shebang}\n${banner}`,
        file: 'dist/unique-mark.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins,
  },
]
