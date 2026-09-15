import { consoleLog } from './browser-console'
import { Result } from './result'
import { ellipsis } from './strings'

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 * @param willLog if true, will console log the data before copying
 * @returns a Result object
 */
export async function copyToClipboard(stuff: number | Readonly<Record<string, unknown>> | readonly Readonly<Record<string, unknown>>[] | readonly string[] | string, willLog = false) {
  let text = ''
  try {
    text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  } catch {
    return Result.error('failed to stringify the data')
  }
  try {
    if (willLog) consoleLog(`copying to clipboard : ${ellipsis(text)}`)

    // oxlint-disable-next-line no-undef
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
 * @param willLog if true, will console log the content of the clipboard
 * @returns the content of the clipboard
 */
export async function readClipboard(willLog = false) {
  const read = await Result.trySafe(Promise.resolve().then(() => globalThis.navigator.clipboard.readText()))
  if (!read.ok) return Result.error('clipboard not available')

  if (willLog) consoleLog('reading clipboard...')

  if (willLog) consoleLog(`got this text from clipboard : ${ellipsis(read.value)}`)

  return Result.ok(read.value)
}
