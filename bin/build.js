import { build as esbuild } from 'esbuild'
import glob from 'tiny-glob'

/**
 * Do the shuutils lib build
 * @returns void
 */
async function doBuild () {
  await esbuild({
    bundle: true,
    banner: { js: '// shuutils __unique-mark__' },
    external: ['tiny-glob'], // but not theses
    outdir: 'dist',
    platform: 'node',
    entryPoints: await glob('src/*.ts'), // build all ts files let the end-user choose global import like import { aFunc } from 'shuutils' or import { aFunc } from 'shuutils/dist/a-specific-file' to force tree-shaking
    format: 'esm',
    target: 'es2020',
  })
}

// @ts-ignore
await doBuild()

