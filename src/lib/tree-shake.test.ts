import { existsSync } from 'node:fs'
import path from 'node:path'
import { build as rolldown } from 'rolldown'
import { invariant } from './invariant.ts'

// test the published bundle, not the sources, so a build step that leaks code is caught too
const distEntry = path.join(import.meta.dirname, '../../dist/shuutils.js')
const entryId = '\0tree-shake-entry'

/**
 * Build a file using rolldown, the bundler behind tsdown
 * @param contents the contents of the file, importing from "shuutils"
 * @returns {Promise<string>} the result of the build, ready for snapshot testing
 */
async function build(contents: string) {
  invariant(existsSync(distEntry), 'dist/shuutils.js is missing, run pnpm run build first')
  const warnings: string[] = []
  const result = await rolldown({
    input: entryId,
    onLog: (level, log) => {
      if (level === 'warn') warnings.push(log.message)
    },
    platform: 'node',
    plugins: [
      {
        load: id => (id === entryId ? contents : undefined),
        name: 'tree-shake-entry',
        resolveId: id => {
          if (id === entryId) return id
          if (id === 'shuutils') return distEntry
          return undefined
        },
      },
    ],
    write: false,
  })
  return `
  ${result.output.length} files built

  ${warnings.length} warnings
  ${warnings.join('\n')}
  ╔══════════════════════════╗
  ║  Input start             ║
  ╚══════════════════════════╝
  ${contents.trim()}
  ╔══════════════════════════╗
  ║  Input end, output start ║
  ╚══════════════════════════╝
  ${result.output[0].code.trim()}
  ╔══════════════════════════╗
  ║  Output end              ║
  ╚══════════════════════════╝`
}

describe('tree-shake', () => {
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
})
