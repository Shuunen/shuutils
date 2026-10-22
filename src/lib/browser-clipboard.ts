import { consoleLog } from './browser-console.ts'
import { isNil } from './is-nil.ts'
import { Result } from './result.ts'
import { ellipsis } from './strings.ts'

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 * @param options the options
 * @param options.log if true, will console log the data before copying
 * @returns a Result object
 */
export async function copyToClipboard(stuff: number | Readonly<Record<string, unknown>> | readonly Readonly<Record<string, unknown>>[] | readonly string[] | string, { log = false }: Readonly<{ log?: boolean }> = {}) {
  let text = ''
  try {
    text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  } catch {
    return Result.error('failed to stringify the data')
  }
  try {
    if (log) consoleLog(`copying to clipboard : ${ellipsis(text)}`)

    await navigator.clipboard.writeText(text)
    return Result.ok(`copied to clipboard : ${ellipsis(text)}`)
  } catch {
    /* v8 ignore start */
    return Result.error('clipboard not available')
    /* v8 ignore stop */
  }
}

/**
 * Read the clipboard content
 * @param options the options
 * @param options.log if true, will console log the content of the clipboard
 * @param options.clipboard the clipboard to read from, default is navigator.clipboard
 * @returns the content of the clipboard
 */
export async function readClipboard({ clipboard = globalThis.navigator?.clipboard, log = false }: Readonly<{ clipboard?: Readonly<Pick<Clipboard, 'readText'>>; log?: boolean }> = {}) {
  if (isNil(clipboard)) return Result.error('clipboard not available')

  const read = await Result.trySafe(Promise.resolve().then(() => clipboard.readText()))
  if (!read.ok) return Result.error('clipboard not available')

  if (log) consoleLog('reading clipboard...')

  if (log) consoleLog(`got this text from clipboard : ${ellipsis(read.value)}`)

  return Result.ok(read.value)
}
