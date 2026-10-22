import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { Result } from '../lib/result.ts'
import { getTargetFiles, init, injectMarkInFiles } from './unique-mark.cli.ts'

const fakeMark = '9.7.8 - xyz - 07/05/2023 17:26:35'
const logFile = 'unique-mark-test.log'
const testFolder = 'unique-mark-test-folder'

describe('unique-mark.cli', () => {
  afterAll(() => {
    rmSync(logFile, { force: true })
    rmSync(testFolder, { force: true, recursive: true })
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

  it('getTargetFiles C list with a simple extension', async () => {
    const result = Result.unwrap(await getTargetFiles('*.md'))
    expect(result.error).toBeUndefined()
    expect(result.value).toContain('README.md')
  })

  it('getTargetFiles D list with no files found', async () => {
    const result = Result.unwrap(await getTargetFiles('nope-*'))
    expect(result.error).toMatchInlineSnapshot(`"no file found with target "nope-*", aborting."`)
  })

  it('getTargetFiles E list every file inside a folder, recursively', async () => {
    mkdirSync(`${testFolder}/nested`, { recursive: true })
    writeFileSync(`${testFolder}/a.js`, '__unique-mark__')
    writeFileSync(`${testFolder}/nested/b.css`, '__unique-mark__')
    const result = Result.unwrap(await getTargetFiles(testFolder))
    expect(result.error).toBeUndefined()
    expect(result.value?.toSorted()).toStrictEqual([`${testFolder}/a.js`, `${testFolder}/nested/b.css`])
  })

  it('getTargetFiles F list an empty folder', async () => {
    mkdirSync(`${testFolder}/empty`, { recursive: true })
    const result = Result.unwrap(await getTargetFiles(`${testFolder}/empty`))
    expect(result.error).toBe(`no file found with target "${testFolder}/empty", aborting.`)
  })

  it('getTargetFiles G list only the js, css and html files of a folder', async () => {
    mkdirSync(`${testFolder}/assets`, { recursive: true })
    writeFileSync(`${testFolder}/assets/logo.png`, new Uint8Array([0x89, 0x50, 0x4e, 0x47]))
    writeFileSync(`${testFolder}/assets/index.html`, '<span id="unique-mark"></span>')
    const result = Result.unwrap(await getTargetFiles(`${testFolder}/assets`))
    expect(result.value).toStrictEqual([`${testFolder}/assets/index.html`])
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

  // Value: protects=an empty placeholder is refused before any file is touched; fails_when=the empty placeholder guard is removed; why_new=no test passed an empty placeholder; seam=none; no_claim=other invalid placeholders
  it('injectMarkInFiles B2 refuses an empty placeholder', () => {
    writeFileSync(logFile, '<p id="">hello</p> ____')
    const result = Result.unwrap(injectMarkInFiles({ files: [logFile], mark: fakeMark, placeholder: '' }))
    expect(result.error).toBe('the placeholder can not be empty, aborting.')
    expect(readFileSync(logFile, 'utf8')).toBe('<p id="">hello</p> ____')
  })

  // Value: protects=a second documented placeholder that stays empty is reported like the plugin does; fails_when=the cli stops comparing the placeholder count with the injected marks; why_new=the other rows have one placeholder per file; seam=none; no_claim=which placeholder was missed
  it('injectMarkInFiles B3 reports a placeholder that could not be replaced next to a replaced one', () => {
    writeFileSync(logFile, '<span id="placeholder"></span> <span id="placeholder"></span>')
    const result = Result.unwrap(injectMarkInFiles({ files: [logFile], isReadOnly: true, mark: fakeMark, placeholder: 'placeholder' }))
    expect(result.value?.totalInjections).toBe(1)
    expect(result.value?.logs).toStrictEqual([`some "placeholder" placeholders have not been replaced in ${logFile}`, `injected in ${logFile} : 1 time`])
  })

  it('injectMarkInFiles C counts a mark holding regex characters', () => {
    writeFileSync(logFile, '__placeholder__ and __placeholder__')
    const result = Result.unwrap(injectMarkInFiles({ files: [logFile], isReadOnly: true, mark: '1.0.0 (beta', placeholder: 'placeholder' }))
    expect(result.value?.totalInjections).toBe(2)
  })

  it('injectMarkInFiles D leaves a file without placeholder untouched', () => {
    const otherFile = `${testFolder}/other.js`
    mkdirSync(testFolder, { recursive: true })
    writeFileSync(logFile, '__placeholder__')
    // 0xff is not valid utf8, a read and write as text would turn it into ef bf bd
    writeFileSync(otherFile, new Uint8Array([0x63, 0xff, 0x64]))
    const result = Result.unwrap(injectMarkInFiles({ files: [logFile, otherFile], mark: fakeMark, placeholder: 'placeholder' }))
    expect(result.value?.totalInjections).toBe(1)
    expect([...readFileSync(otherFile)]).toStrictEqual([0x63, 0xff, 0x64])
    expect(readFileSync(logFile, 'utf8')).toBe(fakeMark)
  })

  it('injectMarkInFiles E does not count nor log a file already holding the mark', () => {
    writeFileSync(logFile, `<span id="placeholder">${fakeMark}</span>`)
    const result = Result.unwrap(injectMarkInFiles({ files: [logFile], isReadOnly: true, mark: fakeMark, placeholder: 'placeholder' }))
    expect(result.value).toStrictEqual({ logs: [], totalInjections: 0 })
  })

  it('injectMarkInFiles F counts only the new marks in a partly marked file', () => {
    writeFileSync(logFile, `<span id="placeholder">${fakeMark}</span> __placeholder__`)
    const result = Result.unwrap(injectMarkInFiles({ files: [logFile], isReadOnly: true, mark: fakeMark, placeholder: 'placeholder' }))
    expect(result.value?.totalInjections).toBe(1)
  })

  // Value: protects=a binary file holding a placeholder is never rewritten as text; fails_when=the cli reads every target as utf8 again; why_new=D only covers a binary without placeholder; seam=none; no_claim=binaries that are valid utf8
  it('injectMarkInFiles G skips a file that is not utf8 text, even with a placeholder', () => {
    const binaryFile = `${testFolder}/binary.js`
    mkdirSync(testFolder, { recursive: true })
    const bytes = [...new TextEncoder().encode('__placeholder__'), 0xff]
    writeFileSync(binaryFile, new Uint8Array(bytes))
    const result = Result.unwrap(injectMarkInFiles({ files: [binaryFile], mark: fakeMark, placeholder: 'placeholder' }))
    expect(result.value).toStrictEqual({ logs: [`skipped ${binaryFile} : not an utf8 text file`], totalInjections: 0 })
    expect([...readFileSync(binaryFile)]).toStrictEqual(bytes)
  })

  // Value: protects=a byte order mark survives the rewrite of a marked file; fails_when=the utf8 decoder strips the bom again; why_new=G only covers non utf8 bytes; seam=none; no_claim=other encodings
  it('injectMarkInFiles H keeps a byte order mark', () => {
    const bomFile = `${testFolder}/bom.html`
    mkdirSync(testFolder, { recursive: true })
    writeFileSync(bomFile, '﻿__placeholder__')
    Result.unwrap(injectMarkInFiles({ files: [bomFile], mark: fakeMark, placeholder: 'placeholder' }))
    expect([...readFileSync(bomFile).subarray(0, 3)]).toStrictEqual([0xef, 0xbb, 0xbf])
    expect(readFileSync(bomFile, 'utf8')).toBe(`﻿${fakeMark}`)
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
    await expect(init(`${logFile.replace('.log', '')}.{log}`)).rejects.toThrow('no mark injected in 1 file, aborting.')
  })

  it('init D with full placeholder', async () => {
    writeFileSync(logFile, 'console.log("hello shuutils __unique-mark__ !");')
    expect(readFileSync(logFile, 'utf8')).toContain('__unique-mark__')
    const result = await init(`${logFile.replace('.log', '')}.{log}`)
    expect(result.value).toMatchInlineSnapshot(`"injected 1 mark in 1 file"`)
    expect(readFileSync(logFile, 'utf8')).not.toContain('__unique-mark__')
  })

  // Value: protects=init on a folder writes the mark in every markable file and reports plurals; fails_when=folder mode skips writes or the summary miscounts; why_new=init only ran on one file; seam=none; no_claim=logs
  it('init F marks every file of a folder target', async () => {
    const folder = `${testFolder}/init-folder`
    mkdirSync(folder, { recursive: true })
    writeFileSync(`${folder}/a.js`, 'const a = "__unique-mark__"')
    writeFileSync(`${folder}/b.html`, '<span id="unique-mark"></span> __unique-mark__')
    const result = await init(folder)
    expect(result.value).toBe('injected 3 marks in 2 files')
    expect([readFileSync(`${folder}/a.js`, 'utf8').includes('__unique-mark__'), readFileSync(`${folder}/b.html`, 'utf8').startsWith('<span id="unique-mark"></span>')]).toStrictEqual([false, false])
  })

  // Value: protects=a folder run that marks nothing fails so a ci build never ships unmarked; fails_when=init only errors for a single file; why_new=init F only covers a folder that gets marked; seam=none; no_claim=exit code of the bin
  it('init G fails on a folder where no mark was injected', async () => {
    const folder = `${testFolder}/init-unmarked`
    mkdirSync(folder, { recursive: true })
    writeFileSync(`${folder}/a.js`, 'const a = 1')
    writeFileSync(`${folder}/b.css`, 'body{}')
    await expect(init(folder)).rejects.toThrow('no mark injected in 2 files, aborting.')
  })

  it('init E marks without a version when the package.json has none', async () => {
    const folder = mkdtempSync(path.join(tmpdir(), 'unique-mark-cli-no-version-'))
    writeFileSync(path.join(folder, 'package.json'), '{"name":"private-app"}')
    writeFileSync(logFile, '__unique-mark__')
    // only the package.json lookup sees the folder, the files are still globbed from the repository
    const cwd = vi.spyOn(process, 'cwd').mockReturnValueOnce(folder)
    const result = await init(`${logFile.replace('.log', '')}.{log}`).finally(() => {
      cwd.mockRestore()
      rmSync(folder, { force: true, recursive: true })
    })
    expect(result.value).toBe('injected 1 mark in 1 file')
    expect(readFileSync(logFile, 'utf8')).toMatch(/^ - [\da-z-]+ - \d{2}\/\d{2}\/\d{4} /u)
  })
})
