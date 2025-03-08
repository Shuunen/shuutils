import { describe, expect, it } from 'vitest'
import { version } from '../package.json'
import { generateMark, getPackageJsonVersion, getTargetFiles, injectMarkInFiles } from './unique-mark'

describe('unique-mark', () => {
  it('getPackageJsonVersion A', () => {
    expect(getPackageJsonVersion()).toBe(version)
  })

  it('getPackageJsonVersion B pkg file not found', () => {
    expect(() => getPackageJsonVersion('non-existent.json')).toThrowErrorMatchingInlineSnapshot(`[Error: package.json was not found in non-existent.json, aborting.]`)
  })

  it('getPackageJsonVersion C pkg file found but invalid json', () => {
    expect(() => getPackageJsonVersion('README.md')).toThrowErrorMatchingInlineSnapshot(`[Error: package.json in README.md is not a valid JSON, aborting.]`)
  })

  it('getTargetFiles A list markdown files at root dir', async () => {
    expect(await getTargetFiles('*.{md}')).toMatchInlineSnapshot(`
      [
        "README.md",
      ]
    `)
  })

  it('getTargetFiles B list without target', async () => {
    await expect(async () => getTargetFiles()).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: no target specified, aborting.]`)
  })

  it('getTargetFiles C list with invalid extension', async () => {
    await expect(async () => getTargetFiles('*.js')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: provided : "*.js", you need to use *.{js} to capture all files with that extension (limitation of tiny-glob)]`,
    )
  })

  it('getTargetFiles D list with no files found', async () => {
    await expect(async () => getTargetFiles('*.{nope}')).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: no file found for target "*.{nope}", aborting.]`)
  })

  const fakeMark = '9.7.8 - xyz - 07/05/2023 17:26:35'
  it('generateMark A', () => {
    expect(generateMark({ commit: 'xyz', date: '07/05/2023 17:26:35', version: '9.7.8' })).toEqual(fakeMark)
  })

  it('injectMarkInFiles A successful', () => {
    expect(injectMarkInFiles({ files: ['src/strings.ts'], isReadOnly: true, mark: fakeMark, placeholder: 'placeholder' })).toMatchInlineSnapshot(`
      {
        "logs": [
          "injected in src/strings.ts : 7 times",
        ],
        "totalInjections": 7,
      }
    `)
  })

  it('injectMarkInFiles B fail to find placeholder', () => {
    expect(() => injectMarkInFiles({ files: ['src/strings.ts'], isReadOnly: true, mark: fakeMark, placeholder: 'nope' })).toThrowErrorMatchingInlineSnapshot(`
      [Error: could not find a place to inject in src/strings.ts, aborting.

      Please use one or more of these placeholders :  <span id="nope"></span>  <meta name="nope" content="">  __nope__]
    `)
  })
})
