import { generateMark, getGitCommit, getPackageJsonVersion, markableRegex, noGitCommit } from '../bin/unique-mark.ts'
import { invariant } from '../lib/invariant.ts'
import { isRecord } from '../lib/object-is-record.ts'
import { countPlaceholders, injectMark } from '../lib/string-inject-mark.ts'
import { fromBase64, toBase64 } from '../lib/url.ts'

// structural subsets of the rollup / rolldown / vite types, so this plugin needs none of them installed
type OutputFile = { code: string; fileName: string; map?: { mappings: string } | null; type: 'chunk' } | { fileName: string; source: string | Uint8Array; type: 'asset' }

type PluginContext = { warn: (message: string) => void }

export type UniqueMarkOptions = {
  /** add a "/* unique-mark : ... *\/" first line to every js and css file, after a shebang or css @charset if any, default true */
  banner?: boolean
  /** the placeholder name, matched as __name__, {{ name }}, <span id="name"></span> or <meta name="name">, default "unique-mark" */
  placeholder?: string
}

export type UniqueMarkPlugin = {
  apply: 'build'
  configResolved: (config: Readonly<{ root: string }>) => void
  enforce: 'post'
  generateBundle: (this: PluginContext, options: unknown, bundle: Record<string, OutputFile>) => void
  name: string
}

// a byte order mark, then a shebang or a css @charset that browsers ignore unless it comes first
const leadingRegex = /^﻿?(?:#!.*\r?\n|@charset "[^"]*";\n?)?/u

/**
 * Prepend a banner comment to a file content, keeping a shebang or a css @charset first
 * @param content the file content
 * @param banner the banner line to add, including its line break
 * @returns the content with the banner
 */
export function addBanner(content: string, banner: string) {
  const leading = leadingRegex.exec(content)?.[0] ?? ''
  return `${leading}${banner}${content.slice(leading.length)}`
}

// only the trailing source map comment counts, an earlier one can sit in a string literal
const inlineMapRegex = /(?<prefix>\/[*/]# sourceMappingURL=data:application\/json;(?:charset=utf-8;)?base64,)(?<data>[\d+/A-Za-z]+={0,2})(?<suffix>\s*(?:\*\/)?\s*)$/u

/**
 * Shift a source map by one generated line, the line the banner adds
 * @param json the source map as json
 * @returns the shifted source map as json, or the same json when it is not a source map
 */
export function shiftSourceMap(json: string) {
  try {
    const map: unknown = JSON.parse(json)
    if (!isRecord(map) || typeof map.mappings !== 'string') return json
    return JSON.stringify({ ...map, mappings: `;${map.mappings}` })
  } catch {
    return json
  }
}

/**
 * Shift a source map inlined as a base64 data url in a file content
 * @param content the file content
 * @returns the content with its inline source map shifted, if any
 */
function shiftInlineSourceMap(content: string) {
  const found = inlineMapRegex.exec(content)
  if (!found?.groups) return content
  const { data = '', prefix = '', suffix = '' } = found.groups
  // a broken inline map decodes to an empty string, which is not a source map, so it does not fail the whole build
  const json = fromBase64(data)
  const shifted = shiftSourceMap(json)
  if (shifted === json) return content
  return `${content.slice(0, found.index)}${prefix}${toBase64(shifted)}${suffix}`
}

/**
 * Shift the source maps of a bundle file by the first line the banner adds, an empty mappings line keeps the rest aligned
 * @param options the options
 * @param options.bundle the whole bundle, holding the .map assets
 * @param options.file the bundle file that got a banner
 * @param options.warn the bundler warn function, for a source map that cannot be shifted
 */
function shiftMapsBelowBanner({ bundle, file, warn }: Readonly<{ bundle: Record<string, OutputFile>; file: OutputFile; warn: (message: string) => void }>) {
  const content = file.type === 'chunk' ? file.code : file.source
  if (typeof content !== 'string') return
  const shifted = shiftInlineSourceMap(content)
  // an index map with sections, or a broken one, keeps its mappings one line off the banner
  if (shifted === content && inlineMapRegex.test(content)) warn(`the inline source map of ${file.fileName} could not be shifted below the banner`)
  if (file.type === 'asset') file.source = shifted
  else {
    file.code = shifted
    if (file.map) file.map.mappings = `;${file.map.mappings}`
  }
  const mapFile = bundle[`${file.fileName}.map`]
  if (mapFile?.type !== 'asset' || typeof mapFile.source !== 'string') return
  const json = shiftSourceMap(mapFile.source)
  if (json === mapFile.source) warn(`the source map ${mapFile.fileName} could not be shifted below the banner`)
  mapFile.source = json
}

/**
 * Inject the mark in a single bundle file
 * @param options the options
 * @param options.content the file content
 * @param options.fileName the file name, like "assets/index.js"
 * @param options.hasBanner true to add a banner comment on js and css files
 * @param options.mark the mark to inject
 * @param options.placeholder the placeholder to replace
 * @returns the updated content, whether a banner was added and whether a placeholder was left untouched
 */
export function markContent({ content, fileName, hasBanner, mark, placeholder }: Readonly<{ content: string; fileName: string; hasBanner: boolean; mark: string; placeholder: string }>) {
  const injected = injectMark(content, placeholder, mark)
  // the bare placeholder word can appear anywhere, a miss is a placeholder-shaped usage that holds no mark, even when another one in the file does
  const isMissed = countPlaceholders(content, placeholder) > injected.split(mark).length - 1
  const hasAddedBanner = hasBanner && !fileName.endsWith('.html')
  const updated = hasAddedBanner ? addBanner(injected, `/* unique-mark : ${mark} */\n`) : injected
  return { hasAddedBanner, isMissed, updated }
}

/**
 * Bundler plugin that injects a unique mark like "4.2.0 - 123abc45 - 01/01/2021 12:00:00" in the built js, css and html files.
 * Works with vite, rolldown, rollup and tsdown, the version comes from the package.json in the vite root or the current working directory.
 * @param options the options
 * @param options.banner add a "/* unique-mark : ... *\/" first line to every js and css file, default true
 * @param options.placeholder the placeholder to replace, default "unique-mark"
 * @returns the plugin to add to the bundler config
 * @example import { uniqueMark } from 'shuutils/plugins'
 * export default defineConfig({ plugins: [uniqueMark()] })
 */
export function uniqueMark({ banner = true, placeholder = 'unique-mark' }: Readonly<UniqueMarkOptions> = {}): UniqueMarkPlugin {
  // an empty placeholder would match id="" and ____ anywhere in the bundle
  invariant(placeholder !== '', 'the uniqueMark placeholder can not be empty')
  let root = process.cwd()
  return {
    apply: 'build',
    configResolved({ root: configRoot }) {
      root = configRoot
    },
    enforce: 'post',
    generateBundle(_options, bundle) {
      // a vite root like "src" often has no package.json, the project one is in the working directory
      const fromRoot = getPackageJsonVersion(`${root}/package.json`)
      const version = fromRoot.ok ? fromRoot : getPackageJsonVersion(`${process.cwd()}/package.json`)
      if (!version.ok) this.warn(`no package.json version found in ${root} nor ${process.cwd()}, the mark has no version`)
      const commit = getGitCommit(root)
      if (commit === noGitCommit) this.warn(`no git commit found in ${root}, the mark has ${noGitCommit} as commit`)
      const mark = generateMark({ commit, version: version.ok ? version.value : '' })
      for (const file of Object.values(bundle)) {
        if (!markableRegex.test(file.fileName)) continue
        const content = file.type === 'chunk' ? file.code : file.source
        if (typeof content !== 'string') continue
        const { hasAddedBanner, isMissed, updated } = markContent({ content, fileName: file.fileName, hasBanner: banner, mark, placeholder })
        if (isMissed) this.warn(`some "${placeholder}" placeholders have not been replaced in ${file.fileName}`)
        if (file.type === 'chunk') file.code = updated
        else file.source = updated
        if (hasAddedBanner) shiftMapsBelowBanner({ bundle, file, warn: message => this.warn(message) })
      }
    },
    name: 'shuutils:unique-mark',
  }
}
