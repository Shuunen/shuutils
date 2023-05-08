import { build as esbuild } from 'esbuild'
import path from 'path'
import { fileURLToPath } from 'url'
import { expect, it } from 'vitest'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const resolveDir = path.join(currentDirectory, '../dist') // eslint-disable-line unicorn/prevent-abbreviations

async function build (contents: string) {
  const result = await esbuild({
    bundle: true, // eslint-disable-line @typescript-eslint/naming-convention
    minify: false, // eslint-disable-line @typescript-eslint/naming-convention
    platform: 'node',
    format: 'esm',
    stdin: { contents, resolveDir },
    write: false, // eslint-disable-line @typescript-eslint/naming-convention
  })
  return {
    output: result.outputFiles[0]?.text,
    nbOutputFiles: result.outputFiles.length,
    warnings: result.warnings,
    errors: result.errors,
  }
}

it('tree-shake test A', async () => {
  expect(await build(`import { getRandomNumber } from '.'
  console.log('tree-shaking test A, only using getRandomNumber', getRandomNumber(1, 10))`)).toMatchSnapshot()
})

it('tree-shake test B', async () => {
  expect(await build(`import { getRandomNumber, getRandomString } from '.'
  console.log('tree-shaking test B, using getRandomNumber and getRandomString', getRandomNumber(1, 10), getRandomString(10))`)).toMatchSnapshot()
})

it('tree-shake test C', async () => {
  expect(await build(`import { readableTimeAgo } from '.'
  console.log('tree-shaking test C, only using readableTimeAgo', readableTimeAgo())`)).toMatchSnapshot()
})