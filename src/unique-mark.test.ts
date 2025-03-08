import { describe, expect, it } from 'bun:test'
import { version } from '../package.json'
import { Result } from './result'
import { generateMark, getPackageJsonVersion, getTargetFiles, injectMarkInFiles } from './unique-mark'

describe('unique-mark', () => {
  it('getPackageJsonVersion A', () => {
    const result = Result.unwrap(getPackageJsonVersion())
    expect(result.error).toMatchInlineSnapshot(`undefined`)
    expect(result.value).toBe(version)
  })

  it('getPackageJsonVersion B pkg file not found', () => {
    const result = Result.unwrap(getPackageJsonVersion('non-existent.json'))
    expect(result.error).toMatchInlineSnapshot(`"package.json was not found in non-existent.json, aborting."`)
    expect(result.value).toMatchInlineSnapshot(`undefined`)
  })

  it('getPackageJsonVersion C pkg file found but invalid json', () => {
    const result = Result.unwrap(getPackageJsonVersion('README.md'))
    expect(result.error).toMatchInlineSnapshot(`"package.json in README.md is not a valid JSON, aborting."`)
    expect(result.value).toMatchInlineSnapshot(`undefined`)
  })

  it('getTargetFiles A list markdown files at root dir', async () => {
    const result = Result.unwrap(await getTargetFiles('*.{md}'))
    expect(result.error).toMatchInlineSnapshot(`undefined`)
    expect(result.value).toMatchInlineSnapshot(`
      [
        "README.md",
      ]
    `)
  })

  it('getTargetFiles B list without target', async () => {
    const result = Result.unwrap(await getTargetFiles())
    expect(result.error).toMatchInlineSnapshot(`"no target specified, aborting."`)
    expect(result.value).toMatchInlineSnapshot(`undefined`)
  })

  it('getTargetFiles C list with invalid extension', async () => {
    const result = Result.unwrap(await getTargetFiles('*.js'))
    expect(result.error).toMatchInlineSnapshot(`"provided : "*.js", you need to use *.{js} to capture all files with that extension (limitation of tiny-glob)"`)
    expect(result.value).toMatchInlineSnapshot(`undefined`)
  })

  it('getTargetFiles D list with no files found', async () => {
    const result = Result.unwrap(await getTargetFiles('*.nope'))
    expect(result.error).toMatchInlineSnapshot(`"provided : "*.nope", you need to use *.{nope} to capture all files with that extension (limitation of tiny-glob)"`)
    expect(result.value).toMatchInlineSnapshot(`undefined`)
  })

  const fakeMark = '9.7.8 - xyz - 07/05/2023 17:26:35'
  it('generateMark A', () => {
    expect(generateMark({ commit: 'xyz', date: '07/05/2023 17:26:35', version: '9.7.8' })).toEqual(fakeMark)
  })

  it('injectMarkInFiles A successful', () => {
    const result = Result.unwrap(injectMarkInFiles({ files: ['src/strings.ts'], isReadOnly: true, mark: fakeMark, placeholder: 'placeholder' }))
    expect(result.error).toMatchInlineSnapshot(`undefined`)
    expect(result.value).toMatchInlineSnapshot(`
      {
        "logs": [
          "injected in src/strings.ts : 7 times",
        ],
        "totalInjections": 7,
      }
    `)
  })

  it('injectMarkInFiles B fail to find placeholder', () => {
    const result = Result.unwrap(injectMarkInFiles({ files: ['src/strings.ts'], isReadOnly: true, mark: fakeMark, placeholder: 'nope' }))
    expect(result.error).toMatchInlineSnapshot(`
      "could not find a place to inject in src/strings.ts, aborting.

      Please use one or more of these placeholders :  <span id="nope"></span>  <meta name="nope" content="">  __nope__"
    `)
    expect(result.value).toMatchInlineSnapshot(`undefined`)
  })
})
