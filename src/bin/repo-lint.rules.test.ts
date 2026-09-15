import { getExportsWithoutJsdoc, hasNoConsoleCall, hasNoRelativeParentImport, isLibFile, isTestFile, rules } from './repo-lint.rules'

const binFile = '/repo/src/bin/repo-lint.cli.ts',
  libFile = '/repo/src/lib/colors.ts'

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

  it('rules A are all named and documented', () => {
    expect(rules.every(rule => rule.name.length > 0 && rule.error.length > 0)).toBe(true)
  })
})
