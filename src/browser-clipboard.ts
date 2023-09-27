/* eslint-disable no-console */
import { ellipsis } from './strings'

/* c8 ignore start */

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 */
export async function copyToClipboard (stuff: Readonly<Record<string, unknown>> | ReadonlyArray<Readonly<Record<string, unknown>>> | ReadonlyArray<string> | number | string) {
  const text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  console.log(`copying to clipboard : ${ellipsis(text)}`)
  await navigator.clipboard.writeText(text)
}

/**
 * Read the clipboard content
 * @returns the content of the clipboard
 */
export async function readClipboard () {
  console.log('reading clipboard...')
  const text = await navigator.clipboard.readText()
  console.log(`got this text from clipboard : ${ellipsis(text)}`)
  return text
}

/* c8 ignore stop */
