/* c8 ignore start */
/* eslint-disable no-console */
import { ellipsis } from './strings'

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 * @param willLog if true, will console log the data before copying
 */
export async function copyToClipboard (stuff: Readonly<Record<string, unknown>> | ReadonlyArray<Readonly<Record<string, unknown>>> | ReadonlyArray<string> | number | string, willLog = false) {
  const text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  if (willLog) console.log(`copying to clipboard : ${ellipsis(text)}`)
  await navigator.clipboard.writeText(text)
}

/**
 * Read the clipboard content
 * @param willLog if true, will console log the content of the clipboard
 * @returns the content of the clipboard
 */
export async function readClipboard (willLog = false) {
  if (willLog) console.log('reading clipboard...')
  const text = await navigator.clipboard.readText()
  if (willLog) console.log(`got this text from clipboard : ${ellipsis(text)}`)
  return text
}

