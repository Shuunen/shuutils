import { build } from 'esbuild'

const shared = {
  bundle: true,
  external: ['tiny-glob'],
  outdir: 'dist',
  platform: 'node',
}

build({
  ...shared,
  entryPoints: ['src/index.ts'],
  outExtension: { '.js': '.cjs' },
  format: 'cjs',
})

build({
  ...shared,
  entryPoints: ['src/index.ts', 'src/unique-mark.ts'],
  outExtension: { '.js': '.esm.js' },
  format: 'esm',
})
