import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getTargetFiles, lintFile, main } from './repo-lint.cli'

const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'shuutils-lint-')),
  argv = (...args: string[]) => ['node', 'repo-lint.cli.ts', ...args]

/**
 * Write a file in the temp folder
 * @param name the file name
 * @param content the file content
 * @returns the absolute path of the written file
 */
function write(name: string, content: string) {
  const filePath = path.join(folder, name)
  fs.writeFileSync(filePath, content, 'utf8')
  return filePath
}

describe('repo-lint.cli', () => {
  it('lintFile A reports an undocumented export', () => {
    const filePath = write('undocumented.ts', 'export function nope() {}\n')
    expect(lintFile(filePath).join(' ')).toContain('jsdoc')
  })

  it('lintFile B accepts a documented bin file', () => {
    const filePath = write('documented.ts', '/**\n * doc\n * @returns nothing\n */\nexport function yep() {}\n')
    expect(lintFile(filePath)).toStrictEqual([])
  })

  it('getTargetFiles A throws without a target', async () => {
    await expect(getTargetFiles(argv())).rejects.toThrow('missing target argument')
  })

  it('getTargetFiles B keeps only typescript sources', async () => {
    const files = await getTargetFiles(argv('--target=src/lib/*.ts'))
    expect(files.every(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))).toBe(true)
    expect(files.length).toBeGreaterThan(0)
  })

  it('main A reports success on a clean file set', async () => {
    await expect(main(argv('--target=src/lib/colors.ts'))).resolves.toContain('All custom rules passed successfully')
  })

  it('main B throws when a file has issues', async () => {
    await expect(main(argv())).rejects.toThrow('missing target argument')
  })
})
