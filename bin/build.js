import { build as esbuild } from 'esbuild'
import glob from 'tiny-glob'

/**
 * Do the shuutils lib build
 * @returns void
 */
async function doBuild () {
  await esbuild({
    banner: { js: '// shuutils __unique-mark__' },
    bundle: true,
    entryPoints: await glob('src/*.ts'), // build all ts files let the end-user choose global import like import { aFunc } from 'shuutils' or import { aFunc } from 'shuutils/dist/a-specific-file' to force tree-shaking
    external: ['tiny-glob'], // but not theses
    format: 'esm',
    outdir: 'dist',
    platform: 'node',
    target: 'es2020',
  })
}

// @ts-ignore
await doBuild()

