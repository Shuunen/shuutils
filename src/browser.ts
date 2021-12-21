import { sleep } from '.'
import { ellipsis } from './strings'

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function copyToClipboard (stuff: string | number | Record<string, any>): void {
  const element = document.createElement('textarea')
  const text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  console.log(`copying to clipboard : ${ellipsis(text)}`)
  element.value = text
  document.body.append(element)
  element.select()
  document.execCommand('copy')
  element.remove()
}

/**
 * Read the clipboard content
 * @returns {string} the content of the clipboard
 */
export const readClipboard = async (): Promise<string> => {
  console.log('reading clipboard...')
  const text = await navigator.clipboard.readText()
  console.log(`got this text from clipboard : ${ellipsis(text)}`)
  return text
}

export const emit = (eventName: string, eventData?: unknown): void => {
  if (global.window === undefined) return
  if (eventData === undefined) window.dispatchEvent(new CustomEvent(eventName))
  else window.dispatchEvent(new CustomEvent(eventName, { detail: eventData }))
}

export const on = (eventName: string, callback: (data: any) => unknown): void => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (global.window === undefined) return
  window.addEventListener(eventName, event => callback(event instanceof CustomEvent ? event.detail : event))
}

/**
 * Detect location.href changes
 * @param callback the callback to call when location.href changes
 * @param wait the time to wait between each check, default 1000ms
 * @param last used for recursion, do not use it
 */
export const onPageChange = async (callback = (location: string) => { console.log(`location changed : ${location} but onPageChange callback is empty`) }, wait = 1000, last = '') => {
  await sleep(wait)
  const current = document.location.href
  if (current !== last) callback(current)
  onPageChange(callback, wait, current)
}
