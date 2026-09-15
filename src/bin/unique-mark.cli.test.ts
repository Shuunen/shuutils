import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import packageJson from '../../package.json' with { type: 'json' }
import { Result } from '../lib/result'
import { generateMark, getPackageJsonVersion, getTargetFiles, init, injectMarkInFiles } from './unique-mark.cli'

const fakeMark = '9.7.8 - xyz - 07/05/2023 17:26:35',
  logFile = 'unique-mark-test.log'

describe('unique-mark.cli', () => {
  afterAll(() => {
    rmSync(logFile, { force: true })
  })

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

  it('getTargetFiles A list markdown files at root dir', async () => {
    const result = Result.unwrap(await getTargetFiles('*.{md}'))
    expect(result.error).toBeUndefined()
    expect(result.value).toContain('README.md')
  })

  it('getTargetFiles B list without target', async () => {
    const result = Result.unwrap(await getTargetFiles(''))
    expect(result.error).toMatchInlineSnapshot(`"no target specified, aborting."`)
  })

  it('getTargetFiles C list with invalid extension', async () => {
    const result = Result.unwrap(await getTargetFiles('*.js'))
    expect(result.error).toMatchInlineSnapshot(`"provided : "*.js", you need to use *.{js} to capture all files with that extension (limitation of tiny-glob)"`)
  })

  it('getTargetFiles D list with no files found', async () => {
    const result = Result.unwrap(await getTargetFiles('nope-*'))
    expect(result.error).toMatchInlineSnapshot(`"no file found with target "nope-*", aborting."`)
  })

  it('generateMark A with every option given', () => {
    expect(generateMark({ commit: 'xyz', date: '07/05/2023 17:26:35', version: '9.7.8' })).toBe(fakeMark)
  })

  it('injectMarkInFiles A successful', () => {
    writeFileSync(logFile, 'hello __placeholder__ !')
    const result = Result.unwrap(injectMarkInFiles({ files: [logFile], isReadOnly: true, mark: fakeMark, placeholder: 'placeholder' }))
    expect(result.error).toBeUndefined()
    expect(result.value?.totalInjections).toBe(1)
  })

  it('injectMarkInFiles B fail to find placeholder', () => {
    writeFileSync(logFile, 'hello !')
    const result = Result.unwrap(injectMarkInFiles({ files: [logFile], isReadOnly: true, mark: fakeMark, placeholder: 'nope' }))
    expect(result.error).toContain('could not find a place to inject in')
  })

  it('init A no targets', async () => {
    await expect(init('')).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: no target specified, aborting.]`)
  })

  it('init B missing placeholder', async () => {
    writeFileSync(logFile, 'console.log("hello shuutils !");')
    await expect(init(`${logFile.replace('.log', '')}.{log}`)).rejects.toThrow('could not find a place to inject in')
  })

  it('init C with partial placeholder', async () => {
    writeFileSync(logFile, 'console.log("hello shuutils !");\n// unique-mark')
    const result = await init(`${logFile.replace('.log', '')}.{log}`)
    expect(result.value).toMatchInlineSnapshot(`"injected 0 mark in 1 file"`)
  })

  it('init D with full placeholder', async () => {
    writeFileSync(logFile, 'console.log("hello shuutils __unique-mark__ !");')
    expect(readFileSync(logFile, 'utf8')).toContain('__unique-mark__')
    const result = await init(`${logFile.replace('.log', '')}.{log}`)
    expect(result.value).toMatchInlineSnapshot(`"injected 1 mark in 1 file"`)
    expect(readFileSync(logFile, 'utf8')).not.toContain('__unique-mark__')
  })
})
