import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { invariant } from '../lib/invariant.ts'
import { getExportsWithoutJsdoc, hasNoConsoleCall, hasNoRelativeParentImport, isLibFile, isTestFile, rules } from './repo-lint.rules.ts'

const binFile = '/repo/src/bin/repo-lint.cli.ts'
const libFile = '/repo/src/lib/colors.ts'

/**
 * Run a named rule on a file content
 * @param name the rule name
 * @param content the file content
 * @param filePath the file path
 * @returns true if the rule passes
 */
function checkRule(name: string, content: string, filePath: string) {
  const rule = rules.find(item => item.name === name)
  invariant(rule, `rule ${name} not found`)
  return rule.check(content, filePath)
}

/**
 * Create a temporary src folder with a lib folder inside
 * @returns the path of the src folder
 */
function createSrcFolder() {
  const src = mkdtempSync(path.join(tmpdir(), 'repo-lint-'))
  mkdirSync(path.join(src, 'lib'))
  return src
}

describe('repo-lint.rules', () => {
  it('isTestFile A detects a test file', () => {
    expect(isTestFile('/repo/src/lib/colors.test.ts')).toBe(true)
  })

  it('isTestFile B rejects a source file', () => {
    expect(isTestFile(libFile)).toBe(false)
  })

  it('isLibFile A accepts a lib module', () => {
    expect(isLibFile(libFile)).toBe(true)
  })

  it('isLibFile B rejects a lib test', () => {
    expect(isLibFile('/repo/src/lib/colors.test.ts')).toBe(false)
  })

  it('isLibFile C rejects a bin module', () => {
    expect(isLibFile(binFile)).toBe(false)
  })

  it('getExportsWithoutJsdoc A finds an undocumented export', () => {
    expect(getExportsWithoutJsdoc('export function nope() {}')).toStrictEqual(['nope'])
  })

  it('getExportsWithoutJsdoc B accepts a documented export', () => {
    expect(getExportsWithoutJsdoc('/**\n * doc\n */\nexport function yep() {}')).toStrictEqual([])
  })

  it('hasNoConsoleCall A rejects a console call in lib', () => {
    expect(hasNoConsoleCall('console.log("hi")', libFile)).toBe(false)
  })

  it('hasNoConsoleCall B allows a console call in bin', () => {
    expect(hasNoConsoleCall('console.log("hi")', binFile)).toBe(true)
  })

  it('hasNoRelativeParentImport A rejects a parent import in lib', () => {
    expect(hasNoRelativeParentImport('import { a } from "../nope"', libFile)).toBe(false)
  })

  it('hasNoRelativeParentImport B allows a sibling import in lib', () => {
    expect(hasNoRelativeParentImport('import { a } from "./yep"', libFile)).toBe(true)
  })

  it('getExportsWithoutJsdoc C flags an export on the first line', () => {
    expect(getExportsWithoutJsdoc('export class Nope {}')).toStrictEqual(['Nope'])
  })

  it('getExportsWithoutJsdoc D skips blank lines and line comments after the JSDoc', () => {
    expect(getExportsWithoutJsdoc('/**\n * doc\n */\n// oxlint-disable-next-line\n\nexport async function yep() {}')).toStrictEqual([])
  })

  it('hasNoRelativeParentImport C allows a parent import outside lib', () => {
    expect(hasNoRelativeParentImport("import { a } from '../lib/a.ts'", binFile)).toBe(true)
  })

  it('exports-have-jsdoc A runs on the file content', () => {
    expect(checkRule('exports-have-jsdoc', 'export function nope() {}', binFile)).toBe(false)
  })

  it('lib-has-test A requires a sibling test for a lib module exporting a function', () => {
    const src = createSrcFolder()
    const module = path.join(src, 'lib', 'thing.ts')
    const hasNoTest = checkRule('lib-has-test', 'export function thing() {}', module)
    writeFileSync(path.join(src, 'lib', 'thing.test.ts'), '')
    const hasTest = checkRule('lib-has-test', 'export function thing() {}', module)
    rmSync(src, { force: true, recursive: true })
    expect(hasNoTest).toBe(false)
    expect(hasTest).toBe(true)
  })

  it('lib-has-test B skips constant only and coverage ignored modules', () => {
    expect(checkRule('lib-has-test', 'export const nbOne = 1', libFile)).toBe(true)
    expect(checkRule('lib-has-test', '/* v8 ignore start */\nexport function untested() {}', libFile)).toBe(true)
  })

  it('barrel-up-to-date A accepts a barrel exporting every lib module', () => {
    const src = createSrcFolder()
    writeFileSync(path.join(src, 'lib', 'a.ts'), '')
    writeFileSync(path.join(src, 'lib', 'b.ts'), '')
    writeFileSync(path.join(src, 'lib', 'a.test.ts'), '')
    writeFileSync(path.join(src, 'lib', 'c.d.ts'), '')
    writeFileSync(path.join(src, 'index.ts'), 'export * from \'./lib/a.ts\'\nexport * from "./lib/b.ts"\n')
    const isUpToDate = checkRule('barrel-up-to-date', '', path.join(src, 'index.ts'))
    rmSync(src, { force: true, recursive: true })
    expect(isUpToDate).toBe(true)
  })

  it('barrel-up-to-date B rejects a barrel entry without the .ts extension', () => {
    const src = createSrcFolder()
    writeFileSync(path.join(src, 'lib', 'a.ts'), '')
    writeFileSync(path.join(src, 'index.ts'), "export * from './lib/a'\n")
    const isUpToDate = checkRule('barrel-up-to-date', '', path.join(src, 'index.ts'))
    rmSync(src, { force: true, recursive: true })
    expect(isUpToDate).toBe(false)
  })

  it('barrel-up-to-date C ignores other files and an index without a lib folder', () => {
    const src = mkdtempSync(path.join(tmpdir(), 'repo-lint-no-lib-'))
    const isUpToDate = checkRule('barrel-up-to-date', '', path.join(src, 'index.ts'))
    rmSync(src, { force: true, recursive: true })
    expect(checkRule('barrel-up-to-date', '', libFile)).toBe(true)
    expect(isUpToDate).toBe(true)
  })

  it('barrel-up-to-date D rejects a barrel missing a lib module', () => {
    const src = createSrcFolder()
    writeFileSync(path.join(src, 'lib', 'a.ts'), '')
    writeFileSync(path.join(src, 'lib', 'b.ts'), '')
    writeFileSync(path.join(src, 'index.ts'), "export * from './lib/a.ts'\n")
    const isUpToDate = checkRule('barrel-up-to-date', '', path.join(src, 'index.ts'))
    rmSync(src, { force: true, recursive: true })
    expect(isUpToDate).toBe(false)
  })

  it('rules A are all named and documented', () => {
    expect(rules.every(rule => rule.name.length > 0 && rule.error.length > 0)).toBe(true)
  })
})
