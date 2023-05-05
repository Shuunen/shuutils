import assert from 'assert'
import { build as esbuild } from 'esbuild'
import { writeFile } from 'fs/promises'
import path from 'path'
import glob from 'tiny-glob'
import { fileURLToPath } from 'url'

// if the tree-shaking is working, the output will be:
const expectedTreeShakeBuild = `// dist/index.js
function getRandomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// <stdin>
console.log("tree-shaking test, only using getRandomNumber", getRandomNumber(1, 10));
`

/**
 * Do the tree-shaking check build
 * @returns the build result
 */
async function doTreeShakeCheckBuild () {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
  // eslint-disable-next-line no-return-await
  return await esbuild({
    bundle: true,
    minify: false, // make the output readable
    platform: 'node',
    format: 'esm',
    stdin: {
      contents: `import { getRandomNumber } from '.'
      console.log('tree-shaking test, only using getRandomNumber', getRandomNumber(1, 10))`,
      resolveDir: path.join(currentDirectory, '../dist'),
    },
    write: false,
  })
}

/**
 * Show the actual and expected tree-shaking build and throw an error
 * @param {string} actual the actual non proper tree-shake build
 */
async function checkTreeShakeFailed (actual) {
  await writeFile('./dist/tree-shaking-test.actual.js', actual, 'utf8')
  await writeFile('./dist/tree-shaking-test.expected.js', expectedTreeShakeBuild, 'utf8')
  console.log(`--- vvv ACTUAL start vvv ---\n${actual}\n--- ^^^ ACTUAL end ^^^ ---`)
  console.log(`--- vvv EXPECTED start vvv ---\n${expectedTreeShakeBuild}\n--- ^^^ EXPECTED end ^^^ ---`)
  throw new Error('tree-shaking build is not as expected, see dist/tree-shaking-test.*.js files')
}

/**
 * Check that tree-shaking is working
 * @returns {Promise<void>}
 */
async function checkTreeShake () {
  const build = await doTreeShakeCheckBuild()
  assert(build.errors.length === 0, 'tree-shaking build should not have errors')
  assert(build.warnings.length === 0, 'tree-shaking build should not have warnings')
  assert(build.outputFiles.length === 1, 'tree-shaking build should have one output file')
  const actual = build.outputFiles[0]?.text || ''
  if (actual !== expectedTreeShakeBuild) checkTreeShakeFailed(actual)
}

/**
 * Do the shuutils lib build
 * @returns {Promise<boolean>} true if the build is ok
 */
async function doBuild () {
  await esbuild({
    bundle: true,
    external: ['tiny-glob'], // but not theses
    outdir: 'dist',
    platform: 'node',
    entryPoints: await glob('src/*.ts'), // build all ts files let the end-user choose global import like import { aFunc } from 'shuutils' or import { aFunc } from 'shuutils/dist/a-specific-file' to force tree-shaking
    format: 'esm',
  })
  await checkTreeShake()
  return true
}

// @ts-ignore
await doBuild()

