/* eslint-disable no-console */
import { Result } from './result'
import { ellipsis } from './strings'

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 * @param willLog if true, will console log the data before copying
 * @param clipboard the clipboard object, default is navigator.clipboard
 * @returns a Result object
 */
export async function copyToClipboard(
  stuff: number | Readonly<Record<string, unknown>> | readonly Readonly<Record<string, unknown>>[] | readonly string[] | string,
  willLog = false,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  clipboard = navigator.clipboard,
) {
  const text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
  if (!clipboard) return Result.error('clipboard not available')
  // biome-ignore lint/suspicious/noConsoleLog: it's ok here
  // biome-ignore lint/suspicious/noConsole: it's ok here
  if (willLog) console.log(`copying to clipboard : ${ellipsis(text)}`)
  await clipboard.writeText(text)
  return Result.ok(`copied to clipboard : ${ellipsis(text)}`)
}

/**
 * Read the clipboard content
 * @param willLog if true, will console log the content of the clipboard
 * @param clipboard the clipboard object, default is navigator.clipboard
 * @returns the content of the clipboard
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export async function readClipboard(willLog = false, clipboard = navigator.clipboard) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
  if (!clipboard) return Result.error('clipboard not available')
  // biome-ignore lint/suspicious/noConsoleLog: it's ok here
  // biome-ignore lint/suspicious/noConsole: it's ok here
  if (willLog) console.log('reading clipboard...')
  const text = await clipboard.readText()
  // biome-ignore lint/suspicious/noConsoleLog: it's ok here
  // biome-ignore lint/suspicious/noConsole: it's ok here
  if (willLog) console.log(`got this text from clipboard : ${ellipsis(text)}`)
  return Result.ok(text)
}
