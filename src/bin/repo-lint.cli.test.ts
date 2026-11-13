import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getTargetFiles, lintFile, main } from './repo-lint.cli.ts'
import { rules } from './repo-lint.rules.ts'

const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'shuutils-lint-'))
const argv = (...args: string[]) => ['node', 'repo-lint.cli.ts', ...args]

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

  it('lintFile C applies a fixer and writes the fixed file', () => {
    const filePath = write('fixable.ts', 'const todo = 1\n')
    const fixableRule = { check: (content: string) => !content.includes('todo'), error: 'no todo', fixer: (content: string) => content.replaceAll('todo', 'done'), name: 'fixable' }
    rules.push(fixableRule)
    const issues = lintFile(filePath)
    rules.splice(rules.indexOf(fixableRule), 1)
    expect(issues).toStrictEqual([])
    expect(fs.readFileSync(filePath, 'utf8')).toBe('const done = 1\n')
  })

  it('lintFile D leaves the file untouched when a fixer changes nothing', () => {
    const filePath = write('unchanged.ts', 'const done = 1\n')
    const idleRule = { check: () => true, error: 'never', fixer: (content: string) => content, name: 'idle' }
    rules.push(idleRule)
    const issues = lintFile(filePath)
    rules.splice(rules.indexOf(idleRule), 1)
    expect(issues).toStrictEqual([])
    expect(fs.readFileSync(filePath, 'utf8')).toBe('const done = 1\n')
  })

  it('getTargetFiles A throws without a target', async () => {
    await expect(getTargetFiles(argv())).rejects.toThrow('missing target argument')
  })

  it('getTargetFiles B keeps only typescript sources', async () => {
    const files = await getTargetFiles(argv('--target=src/lib/*.ts'))
    expect(files.every(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))).toBe(true)
    expect(files.length).toBeGreaterThan(0)
  })

  it('getTargetFiles C ignores arguments without a name', async () => {
    const files = await getTargetFiles(argv('--=ignored', '--target=src/lib/colors.ts'))
    expect(files).toHaveLength(1)
  })

  it('main A reports success on a clean file set', async () => {
    await expect(main(argv('--target=src/lib/colors.ts'))).resolves.toContain('All custom rules passed successfully')
  })

  it('main B throws when a file has issues', async () => {
    await expect(main(argv())).rejects.toThrow('missing target argument')
  })

  it('main C reports the issues of a file and throws', async () => {
    const filePath = write('main-undocumented.ts', 'export function nope() {}\n')
    const consoleError = vi.spyOn(console, 'error').mockReturnValue(undefined)
    await expect(main(argv(`--target=${filePath}`))).rejects.toThrow('Lint issues found.')
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('main-undocumented.ts'))
    consoleError.mockRestore()
  })
})
