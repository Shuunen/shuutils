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

// inspired by this script : https://github.com/benbscholz/detect/blob/master/src/detect.js
class BrowserScout {
  browser = 'unknown'
  isIE = false
  language = 'unknown'
  os = 'unknown'
  platform = 'unknown'
  ua = 'unknown'
  version = 'unknown'
  constructor () {
    this.detect()
  }
  private detect () {
    this.ua = window.navigator.userAgent
    this.platform = this.getPlatform()
    this.browser = this.getBrowser()
    this.isIE = this.browser === 'Internet Explorer'
    this.version = this.getVersion()
    this.os = this.getOS()
    this.language = window.navigator.language
  }
  private getBrowser () {
    if (/MSIE/.test(this.ua) || (/Mozilla/.test(this.ua) && /Trident/.test(this.ua))) return 'Internet Explorer'
    if (/Edg/.test(this.ua)) return 'Edge'
    if (/Chrome/.test(this.ua)) return 'Chrome'
    if (/Opera/.test(this.ua)) return 'Opera'
    if (/Android/.test(this.ua)) return 'Android'
    if (/Firefox/.test(this.ua)) return 'Firefox'
    if (/Safari/.test(this.ua)) return 'Safari'
    return 'Unknown browser'
  }
  private getOS () {
    if (/Safari/.test(this.ua) && (/iPhone/.test(this.ua) || /iPad/.test(this.ua) || /iPod/.test(this.ua))) return 'iOS'
    if (this.platform === 'MacIntel' || this.platform === 'MacPPC') return 'Mac OS X'
    if (this.platform === 'CrOS') return 'ChromeOS'
    if (this.platform === 'Win32' || this.platform === 'Win64' || /Windows/.test(this.ua)) return 'Windows'
    if (/Android/.test(this.ua)) return 'Android'
    if (/Linux/.test(this.platform)) return 'Linux'
    return 'Unknown OS'
  }
  private getPlatform () {
    if (/Chrome/.test(this.ua) && /CrOS/.test(this.ua)) return 'CrOS'
    return window.navigator.platform ?? 'Unknown platform'
  }
  private getVersion () {
    if (/MSIE/.test(this.ua)) return (/MSIE \d+\.\d+/.exec(this.ua) ?? [])[0].split(' ')[1]
    if (/Chrome/.test(this.ua)) return (/Chrome\/[\d.]+/.exec(this.ua) ?? [])[0].split('/')[1]
    if (/Firefox/.test(this.ua)) return (/Firefox\/[\d.]+/.exec(this.ua) ?? [])[0].split('/')[1]
    if (/Version/.test(this.ua)) return (/Version\/[\d.]+/.exec(this.ua) ?? [])[0].split('/')[1]
    if (/rv:(\d+)/.test(this.ua)) return (this.ua.match(/rv:(\d+)/) ?? [])[1]
    return 'Unknown version'
  }
}

export const browserScout = new BrowserScout()

