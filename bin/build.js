import { build } from 'esbuild'
import glob from 'tiny-glob'

/**
 * Do the shuutils lib build
 */
async function doBuild () {

  await build({
    bundle: true,
    external: ['uvu', 'uvu/asserts', 'tiny-glob'], // but not theses
    outdir: 'dist',
    platform: 'node',
    entryPoints: await glob('src/*.ts'), // build all ts files let the end-user choose global import like import { aFunc } from 'shuutils' or import { aFunc } from 'shuutils/dist/a-specific-file' to force tree-shaking
    format: 'esm',
  })

  return true
}

await doBuild()
