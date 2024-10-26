/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build as esbuild } from 'esbuild'
import { expect, it } from 'vitest'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const resolveDir = path.join(currentDirectory, '../dist') // eslint-disable-line unicorn/prevent-abbreviations

/**
 * Remove the hash from the file
 * @param content the content of the file
 * @returns {string} the content of the file without the hash
 */
function clearFileHash(content: string) {
  return content.replace(/(?<name>[a-z]{3,30})-[a-z\d]+(?<ext>\.js)/giu, '$<name>$<ext>')
}

/**
 * Build a file using esbuild
 * @param contents the contents of the file
 * @returns {Promise<{ errors: import('esbuild').Message[], nbOutputFiles: number, output: string, warnings: import('esbuild').Message[] }>} the result of the build
 */
async function build(contents: string) {
  const result = await esbuild({
    bundle: true, // eslint-disable-line @typescript-eslint/naming-convention
    format: 'esm',
    minify: false, // eslint-disable-line @typescript-eslint/naming-convention
    platform: 'node',
    stdin: { contents, resolveDir },
    write: false, // eslint-disable-line @typescript-eslint/naming-convention
  })
  return `
  ${result.outputFiles.length} files built

  ${result.warnings.length} warnings
  ${result.warnings.map(warning => warning.text).join('\n')}
  ${result.errors.length} errors
  ${result.errors.map(error => error.text).join('\n')}
  ╔══════════════════════════╗
  ║  Input start             ║
  ╚══════════════════════════╝
  ${contents.trim()}
  ╔══════════════════════════╗
  ║  Input end, output start ║
  ╚══════════════════════════╝
  ${clearFileHash(result.outputFiles[0]?.text ?? '').trim()}
  ╔══════════════════════════╗
  ║  Output end              ║
  ╚══════════════════════════╝`
}

it('tree-shake test A', async () => {
  const result = await build(`import { randomNumber } from 'shuutils'
  console.log('tree-shaking test A, only using randomNumber', randomNumber(1, 10))`)
  expect(result).toMatchSnapshot()
})

it('tree-shake test B', async () => {
  const result = await build(`import { randomNumber, randomString } from 'shuutils'
  console.log('tree-shaking test B, using randomNumber and randomString', randomNumber(1, 10), randomString(10))`)
  expect(result).toMatchSnapshot()
})

it('tree-shake test C', async () => {
  const result = await build(`import { readableTimeAgo } from 'shuutils'
  console.log('tree-shaking test C, only using readableTimeAgo', readableTimeAgo())`)
  expect(result).toMatchSnapshot()
})

it('tree-shake test D', async () => {
  const result = await build(`import { toastSuccess } from 'shuutils'
  console.log('tree-shaking test D, using toastSuccess', toastSuccess('my message'))`)
  expect(result).toMatchSnapshot()
})
