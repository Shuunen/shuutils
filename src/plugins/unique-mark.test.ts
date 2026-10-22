import { Buffer } from 'node:buffer'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import packageJson from '../../package.json' with { type: 'json' }
import { addBanner, markContent, shiftSourceMap, uniqueMark } from './unique-mark.ts'

const markRegex = /\d+\.\d+\.\d+ - [\da-f]{7,} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/u

/**
 * Run the plugin generateBundle hook on a fake bundle
 * @param bundle the fake bundle
 * @param plugin the plugin to run
 * @returns the warnings emitted by the plugin
 */
function runPlugin(bundle: Parameters<ReturnType<typeof uniqueMark>['generateBundle']>[1], plugin = uniqueMark()) {
  const warnings: string[] = []
  plugin.generateBundle.call({ warn: message => warnings.push(message) }, {}, bundle)
  return warnings
}

describe('unique-mark plugin', () => {
  it('addBanner A prepends the banner', () => {
    expect(addBanner('const a = 1', '/* mark */\n')).toBe('/* mark */\nconst a = 1')
  })

  it('addBanner B keeps the shebang on the first line', () => {
    expect(addBanner('#!/usr/bin/env node\nconst a = 1', '/* mark */\n')).toBe('#!/usr/bin/env node\n/* mark */\nconst a = 1')
  })

  // Value: protects=a shebang ending with a CRLF stays the first line, so the file still parses; fails_when=the shebang regex stops at a carriage return; why_new=B only has a LF shebang; seam=none; no_claim=a shebang without any line break
  it('addBanner B2 keeps a CRLF shebang on the first line', () => {
    expect(addBanner('#!/usr/bin/env node\r\nconst a = 1', '/* mark */\n')).toBe('#!/usr/bin/env node\r\n/* mark */\nconst a = 1')
  })

  it('addBanner C keeps a css charset first', () => {
    expect(addBanner('@charset "UTF-8";a{}', '/* mark */\n')).toBe('@charset "UTF-8";/* mark */\na{}')
    expect(addBanner('@charset "UTF-8";\na{}', '/* mark */\n')).toBe('@charset "UTF-8";\n/* mark */\na{}')
  })

  // Value: protects=a byte order mark stays the very first character, before the charset and the banner; fails_when=the banner is put before the bom again; why_new=C has no bom; seam=none; no_claim=browser charset parsing
  it('addBanner D keeps a byte order mark first', () => {
    expect(addBanner('﻿@charset "UTF-8";\na{}', '/* mark */\n')).toBe('﻿@charset "UTF-8";\n/* mark */\na{}')
    expect(addBanner('﻿a{}', '/* mark */\n')).toBe('﻿/* mark */\na{}')
  })

  it('markContent A injects the mark and adds a banner on js files', () => {
    const result = markContent({ content: 'const v = "__unique-mark__"', fileName: 'index.js', hasBanner: true, mark: 'MARK', placeholder: 'unique-mark' })
    expect(result).toStrictEqual({ hasAddedBanner: true, isMissed: false, updated: '/* unique-mark : MARK */\nconst v = "MARK"' })
  })

  it('markContent B does not add a banner on html files', () => {
    const result = markContent({ content: '<meta name="unique-mark" content="">', fileName: 'index.html', hasBanner: true, mark: 'MARK', placeholder: 'unique-mark' })
    expect(result).toStrictEqual({ hasAddedBanner: false, isMissed: false, updated: '<meta name="unique-mark" content="MARK">' })
  })

  it('markContent C does not add a banner when disabled', () => {
    const result = markContent({ content: 'a{}', fileName: 'style.css', hasBanner: false, mark: 'MARK', placeholder: 'unique-mark' })
    expect(result).toStrictEqual({ hasAddedBanner: false, isMissed: false, updated: 'a{}' })
  })

  it('markContent D flags a placeholder that could not be replaced', () => {
    const result = markContent({ content: 'createElement("span", { id: "unique-mark" })', fileName: 'index.js', hasBanner: false, mark: 'MARK', placeholder: 'unique-mark' })
    expect(result.isMissed).toBe(true)
  })

  it('markContent E does not flag the bare placeholder word', () => {
    const result = markContent({ content: 'const plugin = { name: "shuutils:unique-mark" } // unique-mark', fileName: 'index.js', hasBanner: false, mark: 'MARK', placeholder: 'unique-mark' })
    expect(result).toStrictEqual({ hasAddedBanner: false, isMissed: false, updated: 'const plugin = { name: "shuutils:unique-mark" } // unique-mark' })
  })

  it('markContent G flags an unreplaced placeholder next to a replaced one', () => {
    const result = markContent({ content: '__unique-mark__ createElement("span", { id: "unique-mark" })', fileName: 'index.js', hasBanner: false, mark: 'MARK', placeholder: 'unique-mark' })
    expect(result).toStrictEqual({ hasAddedBanner: false, isMissed: true, updated: 'MARK createElement("span", { id: "unique-mark" })' })
  })

  it('markContent I does not flag a selector reading the mark back', () => {
    const result = markContent({ content: `<meta name="unique-mark" content=""><script>document.querySelector('meta[name="unique-mark"]')</script>`, fileName: 'index.html', hasBanner: true, mark: 'MARK', placeholder: 'unique-mark' })
    expect(result.isMissed).toBe(false)
  })

  it('markContent H does not flag a file already holding the mark', () => {
    const result = markContent({ content: '<span id="unique-mark">MARK</span>', fileName: 'index.html', hasBanner: true, mark: 'MARK', placeholder: 'unique-mark' })
    expect(result).toStrictEqual({ hasAddedBanner: false, isMissed: false, updated: '<span id="unique-mark">MARK</span>' })
  })

  it('uniqueMark A exposes a post build plugin', () => {
    const plugin = uniqueMark()
    expect(plugin.name).toBe('shuutils:unique-mark')
    expect(plugin.apply).toBe('build')
    expect(plugin.enforce).toBe('post')
  })

  // Value: protects=an empty placeholder is refused instead of marking id="" and ____ anywhere; fails_when=the empty placeholder guard is removed; why_new=no test passed an empty placeholder; seam=none; no_claim=other invalid placeholders
  it('uniqueMark A2 refuses an empty placeholder', () => {
    expect(() => uniqueMark({ placeholder: '' })).toThrow('the uniqueMark placeholder can not be empty')
  })

  it('uniqueMark B marks js chunks with the package.json version', () => {
    const bundle = {
      'cli.cjs': { code: '#!/usr/bin/env node\nrun()', fileName: 'cli.cjs', type: 'chunk' as const },
      'index.js': { code: 'console.log("__unique-mark__")', fileName: 'index.js', type: 'chunk' as const },
    }
    expect(runPlugin(bundle)).toStrictEqual([])
    expect(bundle['index.js'].code).toMatch(new RegExp(`^/\\* unique-mark : ${packageJson.version} - .+ \\*/\\nconsole\\.log\\("${packageJson.version} - `, 'u'))
    expect(bundle['index.js'].code).toMatch(markRegex)
    expect(bundle['cli.cjs'].code).toMatch(/^#!\/usr\/bin\/env node\n\/\* unique-mark : .+ \*\/\nrun\(\)$/u)
  })

  it('uniqueMark B2 shifts the source maps by the banner line', () => {
    const bundle = {
      'index.js': { code: 'run()', fileName: 'index.js', map: { mappings: 'AAAA' }, type: 'chunk' as const },
      'index.js.map': { fileName: 'index.js.map', source: '{"version":3,"mappings":"AAAA"}', type: 'asset' as const },
    }
    runPlugin(bundle)
    expect(bundle['index.js'].map.mappings).toBe(';AAAA')
    expect(bundle['index.js.map'].source).toBe('{"version":3,"mappings":";AAAA"}')
  })

  it('uniqueMark B4 shifts an inline source map', () => {
    const inlineMap = Buffer.from('{"version":3,"mappings":"AAAA"}').toString('base64')
    const bundle = { 'index.js': { code: `run()\n//# sourceMappingURL=data:application/json;base64,${inlineMap}`, fileName: 'index.js', type: 'chunk' as const } }
    runPlugin(bundle)
    const shifted = /base64,(?<data>.+)$/u.exec(bundle['index.js'].code)?.groups?.data ?? ''
    expect(Buffer.from(shifted, 'base64').toString('utf8')).toBe('{"version":3,"mappings":";AAAA"}')
  })

  it('uniqueMark B5 only shifts the trailing inline source map and survives a broken one', () => {
    const inlineMap = Buffer.from('{"version":3,"mappings":"AAAA"}').toString('base64')
    const quoted = `const doc = "//# sourceMappingURL=data:application/json;base64,${inlineMap}"`
    const bundle = {
      'broken.js': { code: 'run()\n//# sourceMappingURL=data:application/json;base64,eyJ2_ZXJ', fileName: 'broken.js', type: 'chunk' as const },
      'index.js': { code: `${quoted}\n//# sourceMappingURL=data:application/json;base64,${inlineMap}\n`, fileName: 'index.js', type: 'chunk' as const },
    }
    expect(runPlugin(bundle)).toStrictEqual([])
    expect(bundle['broken.js'].code).toMatch(/base64,eyJ2_ZXJ$/u)
    expect(bundle['index.js'].code).toContain(quoted)
    const shifted = /base64,(?<data>[^\n]+)\n$/u.exec(bundle['index.js'].code)?.groups?.data ?? ''
    expect(Buffer.from(shifted, 'base64').toString('utf8')).toBe('{"version":3,"mappings":";AAAA"}')
  })

  // Value: protects=a source map the plugin cannot shift is reported instead of silently off by one line; fails_when=the map asset warning is dropped; why_new=B2 only has shiftable maps; seam=none; no_claim=real index maps from a bundler
  it('uniqueMark B8 warns about an index source map it cannot shift', () => {
    const indexMap = '{"version":3,"sections":[]}'
    const bundle = {
      'index.js': { code: 'run()', fileName: 'index.js', type: 'chunk' as const },
      'index.js.map': { fileName: 'index.js.map', source: indexMap, type: 'asset' as const },
    }
    expect(runPlugin(bundle)).toStrictEqual(['the source map index.js.map could not be shifted below the banner'])
    expect(bundle['index.js.map'].source).toBe(indexMap)
  })

  // Value: protects=a css asset with an inline block comment source map is shifted below the banner and keeps its closing comment; fails_when=the asset branch stops writing the shifted source or the css map comment shape is not matched;
  // why_new=B4 to B7 only cover js chunks with a line comment map; seam=none; no_claim=real css source map consumers (fake bundle; unit only)
  it('uniqueMark B9 shifts the inline source map of a css asset', () => {
    const inlineMap = Buffer.from('{"version":3,"mappings":"AAAA"}').toString('base64')
    const bundle = { 'style.css': { fileName: 'style.css', source: `a{}\n/*# sourceMappingURL=data:application/json;base64,${inlineMap} */`, type: 'asset' as const } }
    expect(runPlugin(bundle)).toStrictEqual([])
    const found = /^\/\* unique-mark : .+ \*\/\na\{\}\n\/\*# sourceMappingURL=data:application\/json;base64,(?<data>[^ ]+) \*\/$/u.exec(bundle['style.css'].source)
    expect(found?.groups?.data).toBeDefined()
    expect(Buffer.from(found?.groups?.data ?? '', 'base64').toString('utf8')).toBe('{"version":3,"mappings":";AAAA"}')
  })

  it('shiftSourceMap A leaves anything else than a source map as is', () => {
    expect(shiftSourceMap('not json')).toBe('not json')
    expect(shiftSourceMap('{"version":3}')).toBe('{"version":3}')
  })

  it('uniqueMark B3 keeps the source maps without a banner', () => {
    const bundle = {
      'index.js': { code: 'run()', fileName: 'index.js', map: { mappings: 'AAAA' }, type: 'chunk' as const },
      'index.js.map': { fileName: 'index.js.map', source: '{"version":3,"mappings":"AAAA"}', type: 'asset' as const },
    }
    runPlugin(bundle, uniqueMark({ banner: false }))
    expect(bundle['index.js'].map.mappings).toBe('AAAA')
    expect(bundle['index.js.map'].source).toBe('{"version":3,"mappings":"AAAA"}')
  })

  it('uniqueMark C marks css and html assets', () => {
    const bundle = {
      'index.html': { fileName: 'index.html', source: '<span id="unique-mark"></span>', type: 'asset' as const },
      'style.css': { fileName: 'style.css', source: 'a{}', type: 'asset' as const },
    }
    runPlugin(bundle)
    expect(bundle['style.css'].source).toMatch(/^\/\* unique-mark : .+ \*\/\na\{\}$/u)
    expect(bundle['index.html'].source).toMatch(new RegExp(`^<span id="unique-mark">${packageJson.version} - .+</span>$`, 'u'))
  })

  it('uniqueMark D skips binary assets, declaration files and unknown extensions', () => {
    const bytes = new Uint8Array([1, 2, 3])
    const bundle = {
      'image.js': { fileName: 'image.js', source: bytes, type: 'asset' as const },
      'index.d.ts': { code: '__unique-mark__', fileName: 'index.d.ts', type: 'chunk' as const },
      'logo.svg': { fileName: 'logo.svg', source: '__unique-mark__', type: 'asset' as const },
    }
    runPlugin(bundle)
    expect(bundle['image.js'].source).toBe(bytes)
    expect(bundle['index.d.ts'].code).toBe('__unique-mark__')
    expect(bundle['logo.svg'].source).toBe('__unique-mark__')
  })

  it('uniqueMark E warns about placeholders left untouched', () => {
    const bundle = { 'index.js': { code: 'createElement("span", { id: "my-mark" })', fileName: 'index.js', type: 'chunk' as const } }
    const warnings = runPlugin(bundle, uniqueMark({ placeholder: 'my-mark' }))
    expect(warnings).toStrictEqual(['some "my-mark" placeholders have not been replaced in index.js'])
    expect(bundle['index.js'].code).toMatch(/^\/\* unique-mark : /u)
  })

  it('uniqueMark F reads the version from the resolved config root', () => {
    const testFolder = mkdtempSync(path.join(tmpdir(), 'unique-mark-plugin-'))
    writeFileSync(path.join(testFolder, 'package.json'), JSON.stringify({ version: '9.8.7' }))
    const plugin = uniqueMark({ banner: false })
    plugin.configResolved({ root: testFolder })
    const bundle = { 'index.js': { code: '__unique-mark__', fileName: 'index.js', type: 'chunk' as const } }
    runPlugin(bundle, plugin)
    rmSync(testFolder, { force: true, recursive: true })
    // the commit comes from the root too, a temp folder outside any git repository
    expect(bundle['index.js'].code).toMatch(/^9\.8\.7 - no-git-commit - /u)
  })

  it('uniqueMark G falls back to the working directory package.json when the root has none', () => {
    const plugin = uniqueMark({ banner: false })
    // a vite root like "src" exists, sits in the git repository and holds no package.json
    plugin.configResolved({ root: path.join(process.cwd(), 'src') })
    const bundle = { 'index.js': { code: '__unique-mark__', fileName: 'index.js', type: 'chunk' as const } }
    expect(runPlugin(bundle, plugin)).toStrictEqual([])
    expect(bundle['index.js'].code).toMatch(new RegExp(`^${packageJson.version} - `, 'u'))
  })

  // Value: protects=a build outside a git repository is told that the mark has no commit; fails_when=the no-git-commit fallback is shipped without a warning; why_new=F only checks the version and G the fallback of the version; seam=none; no_claim=git failing for another reason
  it('uniqueMark G2 warns when the git commit cannot be read', () => {
    const testFolder = mkdtempSync(path.join(tmpdir(), 'unique-mark-plugin-no-git-'))
    writeFileSync(path.join(testFolder, 'package.json'), JSON.stringify({ version: '1.2.3' }))
    const plugin = uniqueMark({ banner: false })
    plugin.configResolved({ root: testFolder })
    const bundle = { 'index.js': { code: '__unique-mark__', fileName: 'index.js', type: 'chunk' as const } }
    const warnings = runPlugin(bundle, plugin)
    rmSync(testFolder, { force: true, recursive: true })
    expect(warnings).toStrictEqual([`no git commit found in ${testFolder}, the mark has no-git-commit as commit`])
  })

  it('uniqueMark H warns and uses an empty version when no package.json is found', () => {
    const plugin = uniqueMark({ banner: false })
    const root = path.join(process.cwd(), 'src')
    plugin.configResolved({ root })
    const cwd = vi.spyOn(process, 'cwd').mockReturnValue('non-existent-cwd')
    const bundle = { 'index.js': { code: '__unique-mark__', fileName: 'index.js', type: 'chunk' as const } }
    let warnings: string[] = []
    try {
      warnings = runPlugin(bundle, plugin)
    } finally {
      cwd.mockRestore()
    }
    expect(warnings).toStrictEqual([`no package.json version found in ${root} nor non-existent-cwd, the mark has no version`])
    expect(bundle['index.js'].code).toMatch(/^ - /u)
  })

  it('markContent F matches a placeholder with regex characters as is', () => {
    const result = markContent({ content: '__app.mark__ __appXmark__', fileName: 'index.js', hasBanner: false, mark: 'MARK', placeholder: 'app.mark' })
    expect(result).toStrictEqual({ hasAddedBanner: false, isMissed: false, updated: 'MARK __appXmark__' })
    expect(markContent({ content: '__mark(1)__', fileName: 'index.js', hasBanner: false, mark: 'MARK', placeholder: 'mark(1)' }).updated).toBe('MARK')
  })

  // Value: protects=a non decodable inline source map leaves the chunk as is instead of failing the build; fails_when=a non decodable map is no longer left as is, like a decode that throws;
  // why_new=B5 broken map does not match the inline map regex, so the decode catch never runs; seam=none; no_claim=real bundler error reporting (fake bundle; unit only)
  it('uniqueMark B6 keeps an inline source map that is not valid base64', () => {
    const bundle = { 'index.js': { code: 'run()\n//# sourceMappingURL=data:application/json;base64,a', fileName: 'index.js', type: 'chunk' as const } }
    expect(runPlugin(bundle)).toStrictEqual(['the inline source map of index.js could not be shifted below the banner'])
    expect(bundle['index.js'].code).toMatch(/^\/\* unique-mark : .+ \*\/\nrun\(\)\n\/\/# sourceMappingURL=data:application\/json;base64,a$/u)
  })

  // Value: protects=an inline source map with non ascii sources is shifted and stays valid utf-8; fails_when=fromBase64 or toBase64 stop round-tripping non ascii utf-8, like a plain atob or btoa;
  // why_new=B4 and B5 only use ascii maps, which every base64 variant round-trips; seam=none; no_claim=source map consumers reading the result (fake bundle; unit only)
  it('uniqueMark B7 shifts an inline source map holding non ascii sources', () => {
    const map = '{"version":3,"sourcesContent":["const greet = \'日本 é\'"],"mappings":"AAAA"}'
    const bundle = { 'index.js': { code: `run()\n//# sourceMappingURL=data:application/json;base64,${Buffer.from(map).toString('base64')}`, fileName: 'index.js', type: 'chunk' as const } }
    runPlugin(bundle)
    const shifted = /base64,(?<data>.+)$/u.exec(bundle['index.js'].code)?.groups?.data ?? ''
    expect(Buffer.from(shifted, 'base64').toString('utf8')).toBe('{"version":3,"sourcesContent":["const greet = \'日本 é\'"],"mappings":";AAAA"}')
  })
})
