import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import packageJson from '../../package.json' with { type: 'json' }
import { Result } from '../lib/result.ts'
import { generateMark, getGitCommit, getPackageJsonVersion } from './unique-mark.ts'

describe('unique-mark', () => {
  it('getPackageJsonVersion A reads the local package.json', () => {
    const result = Result.unwrap(getPackageJsonVersion())
    expect(result.error).toBeUndefined()
    expect(result.value).toBe(packageJson.version)
  })

  it('getPackageJsonVersion B pkg file not found', () => {
    const result = Result.unwrap(getPackageJsonVersion('non-existent.json'))
    expect(result.error).toMatchInlineSnapshot(`"package.json was not found in non-existent.json, aborting."`)
  })

  it('getPackageJsonVersion C pkg file found but invalid json', () => {
    const result = Result.unwrap(getPackageJsonVersion('README.md'))
    expect(result.error).toMatchInlineSnapshot(`"package.json in README.md is not a valid JSON, aborting."`)
  })

  // Value: protects=a package.json without a string version, or a bare null json, gives a no version error; fails_when=the optional chaining or the string check on version is dropped;
  // why_new=D only covered a missing version key; seam=none; no_claim=none beyond protects
  it('getPackageJsonVersion D pkg file without a version', () => {
    const folder = mkdtempSync(path.join(tmpdir(), 'unique-mark-no-version-'))
    writeFileSync(path.join(folder, 'package.json'), '{"name":"private-app"}')
    const result = Result.unwrap(getPackageJsonVersion(path.join(folder, 'package.json')))
    writeFileSync(path.join(folder, 'null.json'), 'null')
    writeFileSync(path.join(folder, 'number.json'), '{"version":1}')
    const fromNull = Result.unwrap(getPackageJsonVersion(path.join(folder, 'null.json')))
    const fromNumber = Result.unwrap(getPackageJsonVersion(path.join(folder, 'number.json')))
    rmSync(folder, { force: true, recursive: true })
    expect(result.error).toContain('has no version')
    expect(fromNull.error).toContain('has no version')
    expect(fromNumber.error).toContain('has no version')
  })

  it('getGitCommit A returns the short hash of the current repository', () => {
    expect(getGitCommit()).toMatch(/^[\da-f]{7,}$/u)
  })

  it('getGitCommit B falls back when git cannot run in the given folder', () => {
    const missingFolder = path.join(tmpdir(), 'unique-mark-missing-folder')
    expect(getGitCommit(missingFolder)).toBe('no-git-commit')
  })

  it('getGitCommit C falls back in an existing folder outside any repository', () => {
    const folder = mkdtempSync(path.join(tmpdir(), 'unique-mark-no-repo-'))
    const commit = getGitCommit(folder)
    rmSync(folder, { force: true, recursive: true })
    expect(commit).toBe('no-git-commit')
  })

  it('generateMark A with every option given', () => {
    expect(generateMark({ commit: 'xyz', date: '07/05/2023 17:26:35', version: '9.7.8' })).toBe('9.7.8 - xyz - 07/05/2023 17:26:35')
  })

  it('generateMark B with the current commit and date', () => {
    expect(generateMark({ version: '1.2.3' })).toMatch(/^1\.2\.3 - [\da-f]{7,} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/u)
  })
})
