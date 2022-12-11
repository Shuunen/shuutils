import assert from 'assert'
// eslint-disable-next-line import/no-extraneous-dependencies
import { build } from 'esbuild'
import { writeFile } from 'fs/promises'
import path from 'path'
import glob from 'tiny-glob'
import { fileURLToPath } from 'url'

/**
 * Check that tree-shaking is working
 * @returns {Promise<void>}
 */
// eslint-disable-next-line max-statements
async function checkTreeShake () {
  // cross the fingers and hope that esbuild will not change the output
  const expected = `// dist/index.js
var msInMinute = 60 * 1e3;
var msInHour = 60 * 60 * 1e3;
var msInDay = 24 * 60 * 60 * 1e3;
var msInWeek = 7 * 24 * 60 * 60 * 1e3;
var msInMonth = 30 * 24 * 60 * 60 * 1e3;
var msInYear = 365 * 24 * 60 * 60 * 1e3;
function getRandomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// <stdin>
console.log("tree-shaking test, only using getRandomNumber", getRandomNumber(1, 10));
`
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
  const treeShakeBuild = await build({
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

  assert(treeShakeBuild.errors.length === 0, 'tree-shaking build should not have errors')
  assert(treeShakeBuild.warnings.length === 0, 'tree-shaking build should not have warnings')
  assert(treeShakeBuild.outputFiles.length === 1, 'tree-shaking build should have one output file')
  const actual = treeShakeBuild.outputFiles[0].text
  if (actual !== expected) {
    await writeFile('./dist/tree-shaking-test.actual.js', actual, 'utf8')
    await writeFile('./dist/tree-shaking-test.expected.js', expected, 'utf8')
    console.log(`--- vvv ACTUAL start vvv ---\n${actual}\n--- ^^^ ACTUAL end ^^^ ---`)
    console.log(`--- vvv EXPECTED start vvv ---\n${expected}\n--- ^^^ EXPECTED end ^^^ ---`)
    throw new Error('tree-shaking build is not as expected, see dist/tree-shaking-test.*.js files')
  }
}

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
  await checkTreeShake()
  return true
}

await doBuild()
