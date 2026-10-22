import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { nbThird } from '../lib/constants.ts'
import { Logger } from '../lib/logger.ts'
import { Result } from '../lib/result.ts'
import { countPlaceholders, injectMark } from '../lib/string-inject-mark.ts'
import { globFiles } from './glob-files.ts'
import { generateMark, getPackageJsonVersion, markableRegex } from './unique-mark.ts'

// ignoreBOM keeps a byte order mark in the text, so a rewritten file keeps it too
const utf8Decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })

// use me like :
// npx unique-mark "public/*.{js}"
// npx unique-mark public

/**
 * Get the files to inject the mark in
 * @param target the glob to get files from, like "public/index.html" or "public/*.js", or a folder like "public" to target every js, css and html file inside it
 * @returns the files to inject the mark in
 */
export async function getTargetFiles(target = process.argv[nbThird] ?? '') {
  if (target === '') return Result.error('no target specified, aborting.')

  const isFolder = existsSync(target) && statSync(target).isDirectory()
  const found = await globFiles(isFolder ? path.posix.join(target, '**/*') : target, { filesOnly: isFolder })
  const files = isFolder ? found.filter(file => markableRegex.test(file)) : found
  if (files.length === 0) return Result.error(`no file found with target "${target}", aborting.`)

  return Result.ok(files)
}

/**
 * Inject the mark in the given files
 * @param options the options
 * @param options.files the files to inject the mark in
 * @param options.isReadOnly if true, will not write the files on disk (useful for unit tests)
 * @param options.mark the mark to inject
 * @param options.placeholder the placeholder to use to inject the mark
 * @returns the total amount of mark injections in the targeted files
 */
export function injectMarkInFiles({ files = [], isReadOnly = false, mark = 'no-mark', placeholder = 'unique-mark' }: Readonly<{ files?: readonly string[]; isReadOnly?: boolean; mark?: string; placeholder?: string }>) {
  // an empty placeholder would match id="" and ____ anywhere in the files
  if (placeholder === '') return Result.error('the placeholder can not be empty, aborting.')
  let totalInjections = 0
  const logs: string[] = []
  for (const file of files) {
    // a binary file like an image is not valid utf8, reading and writing it as text would corrupt it
    const decoded = Result.trySafe(() => utf8Decoder.decode(readFileSync(file)))
    if (!decoded.ok) {
      logs.push(`skipped ${file} : not an utf8 text file`)
      continue
    }
    const content = decoded.value
    if (!content.includes(placeholder) && files.length === 1)
      return Result.error(
        `could not find a place to inject in ${file}, aborting.\n\nPlease use one or more of these placeholders :  <span id="${placeholder}"></span>  <meta name="${placeholder}" content="">  __${placeholder}__  {{ ${placeholder} }}`,
      )

    const updatedContent = injectMark(content, placeholder, mark)
    // like the uniqueMark plugin, a placeholder-shaped usage that holds no mark is reported, even when another one in the file got it
    if (countPlaceholders(content, placeholder) > updatedContent.split(mark).length - 1) logs.push(`some "${placeholder}" placeholders have not been replaced in ${file}`)
    // a file without placeholder, or already holding this mark, keeps its exact bytes
    if (updatedContent === content) continue
    const times = updatedContent.split(mark).length - content.split(mark).length
    if (!isReadOnly) writeFileSync(file, updatedContent)

    logs.push(`injected in ${file} : ${times} time${times > 1 ? 's' : ''}`)
    totalInjections += times
  }
  return Result.ok({ logs, totalInjections })
}

/**
 * Main function
 * @param target the glob to get files from, like "public/index.html" or "public/*.js", or a folder like "public" to target every js, css and html file inside it
 * @returns a Result object
 */
export async function init(target = process.argv[nbThird] ?? '') {
  const logger = new Logger({ minimumLevel: import.meta.main ? '3-info' : '7-error' })
  logger.debug('starting...')
  const version = getPackageJsonVersion()
  // like the uniqueMark plugin, a private app package.json without version still gets a mark
  if (!version.ok) logger.warn(`no package.json version found in ${process.cwd()}, the mark has no version`)

  const files = await getTargetFiles(target)
  if (!files.ok) throw new Error(files.error)

  logger.debug(`found ${files.value.length} file${files.value.length > 1 ? 's' : ''} to inject mark in :`, files.value.join(', '))
  const mark = generateMark({ version: version.ok ? version.value : '' })
  logger.debug('generated mark', mark)
  const result = injectMarkInFiles({ files: files.value, mark })
  if (!result.ok) throw new Error(result.error)

  const { logs, totalInjections } = result.value
  for (const line of logs) logger.info(line)

  // a ci build must not ship unmarked, whether one file or a whole folder was targeted
  if (totalInjections === 0) throw new Error(`no mark injected in ${files.value.length} file${files.value.length > 1 ? 's' : ''}, aborting.`)
  logger.success('total injections :', String(totalInjections))

  return Result.ok(`injected ${totalInjections} mark${totalInjections > 1 ? 's' : ''} in ${files.value.length} file${files.value.length > 1 ? 's' : ''}`)
}

/* v8 ignore start */
if (import.meta.main) await init()
