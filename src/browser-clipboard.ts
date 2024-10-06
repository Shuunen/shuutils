/* c8 ignore start */
/* eslint-disable no-console */
import { ellipsis } from './strings'

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 * @param willLog if true, will console log the data before copying
 */
export async function copyToClipboard(
  stuff: Readonly<Record<string, unknown>> | number | readonly Readonly<Record<string, unknown>>[] | readonly string[] | string,
  willLog = false,
) {
  const text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  // biome-ignore lint/suspicious/noConsoleLog: it's ok here
  // biome-ignore lint/suspicious/noConsole: it's ok here
  if (willLog) console.log(`copying to clipboard : ${ellipsis(text)}`)
  await navigator.clipboard.writeText(text)
}

/**
 * Read the clipboard content
 * @param willLog if true, will console log the content of the clipboard
 * @returns the content of the clipboard
 */
export async function readClipboard(willLog = false) {
  // biome-ignore lint/suspicious/noConsoleLog: it's ok here
  // biome-ignore lint/suspicious/noConsole: it's ok here
  if (willLog) console.log('reading clipboard...')
  const text = await navigator.clipboard.readText()
  // biome-ignore lint/suspicious/noConsoleLog: it's ok here
  // biome-ignore lint/suspicious/noConsole: it's ok here
  if (willLog) console.log(`got this text from clipboard : ${ellipsis(text)}`)
  return text
}
