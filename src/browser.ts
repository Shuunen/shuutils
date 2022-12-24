import { sleep } from './functions'
import { ellipsis } from './strings'
import type { NavigatorExtract, NavigatorUserAgent } from './types'

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 */
export async function copyToClipboard (stuff: Record<string, unknown> | Record<string, unknown>[] | string[] | number | string): Promise<void> {
  const text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  console.log(`copying to clipboard : ${ellipsis(text)}`)
  await navigator.clipboard.writeText(text)
}

/**
 * Read the clipboard content
 * @returns {string} the content of the clipboard
 */
export async function readClipboard (): Promise<string> {
  console.log('reading clipboard...')
  const text = await navigator.clipboard.readText()
  console.log(`got this text from clipboard : ${ellipsis(text)}`)
  return text
}

/**
 * Default callback for onPageChange
 * @param location the new location
 * @returns {void} nothing
 */
export function onPageChangeDefaultCallback (location: string): void {
  console.log(`location changed : ${location} but onPageChange callback is empty`)
}

/**
 * Detect location.href changes
 * @param callback the callback to call when location.href changes
 * @param wait the time to wait between each check, default 1000ms
 * @param last used for recursion, do not use it
 */
export async function onPageChange (callback = onPageChangeDefaultCallback, wait = 1000, last = ''): Promise<void> {
  await sleep(wait)
  const current = document.location.href
  if (current !== last) callback(current)
  void onPageChange(callback, wait, current)
}

/**
 * Detect the browser context, inspired by this script : https://github.com/benbscholz/detect/blob/master/src/detect.js
 */
export class BrowserScout {

  public browser: 'Android' | 'Chrome' | 'Edge' | 'Firefox' | 'Internet Explorer' | 'Opera' | 'Safari' | 'Unknown browser' = 'Unknown browser'

  public isIE = false

  public language = 'Unknown language'

  public os: 'Android' | 'ChromeOS' | 'iOS' | 'Linux' | 'Mac OS X' | 'Unknown OS' | 'Windows' = 'Unknown OS'

  public platform = 'Unknown platform'

  public ua = 'Unknown UA'

  public version = 'Unknown version'

  /**
   * BrowserScout constructor
   */
  public constructor () {
    this.detect()
  }

  /**
   * Return the navigator in a safe way for non-browser environments
   * @returns {NavigatorExtract} the navigator
   */
  public get navigator (): NavigatorExtract {
    const extract = {
      userAgent: 'Undefined window userAgent',
      language: 'Undefined window language',
      platform: 'Undefined window platform',
    }
    if (typeof window !== 'undefined') {
      extract.userAgent = window.navigator.userAgent
      extract.language = window.navigator.language
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      extract.platform = (window.navigator as NavigatorUserAgent).userAgentData?.platform ?? 'Unknown platform'
    }
    return extract
  }

  /**
   * Detect the browser context
   */
  private detect (): void {
    this.ua = this.navigator.userAgent
    this.platform = this.getPlatform()
    this.browser = this.getBrowser()
    this.isIE = this.browser === 'Internet Explorer'
    this.version = this.getVersion()
    this.os = this.getOperatingSystem()
    this.language = this.navigator.language
  }

  /**
   * Get the browser name
   * @returns {string} the browser name
   */
  private getBrowser (): this['browser'] {
    if (this.ua.includes('MSIE') || (this.ua.includes('Mozilla') && this.ua.includes('Trident'))) return 'Internet Explorer'
    if (this.ua.includes('Edg')) return 'Edge'
    if (this.ua.includes('Chrome')) return 'Chrome'
    if (this.ua.includes('Opera')) return 'Opera'
    if (this.ua.includes('Android')) return 'Android'
    if (this.ua.includes('Firefox')) return 'Firefox'
    if (this.ua.includes('Safari')) return 'Safari'
    return 'Unknown browser'
  }

  /**
   * Get the operating system name
   * @returns {string} the operating system name
   */
  // eslint-disable-next-line complexity
  private getOperatingSystem (): this['os'] {
    if (this.ua.includes('Safari') && (this.ua.includes('iPhone') || this.ua.includes('iPad') || this.ua.includes('iPod'))) return 'iOS'
    if (this.platform === 'MacIntel' || this.platform === 'MacPPC') return 'Mac OS X'
    if (this.platform === 'CrOS') return 'ChromeOS'
    if (this.platform === 'Win32' || this.platform === 'Win64' || this.ua.includes('Windows')) return 'Windows'
    if (this.ua.includes('Android')) return 'Android'
    if (this.platform.includes('Linux')) return 'Linux'
    return 'Unknown OS'
  }

  /**
   * Get the platform name
   * @returns {string} the platform name
   */
  private getPlatform (): this['platform'] {
    if (this.ua.includes('Chrome') && this.ua.includes('CrOS')) return 'CrOS'
    return this.navigator.platform
  }

  /**
   * Get the browser version
   * @returns {string} the browser version
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity, complexity
  private getVersion (): this['version'] {
    if (this.ua.includes('MSIE')) return ((/MSIE [\d.]+/u.exec(this.ua)) ?? [])[1] ?? 'Unknown MSIE version'
    if (this.ua.includes('Chrome')) return ((/Chrome\/[\d.]+/u.exec(this.ua)) ?? [])[1] ?? 'Unknown Chrome version'
    if (this.ua.includes('Firefox')) return ((/Firefox\/[\d.]+/u.exec(this.ua)) ?? [])[1] ?? 'Unknown Firefox version'
    if (this.ua.includes('Version')) return ((/Version\/[\d.]+/u.exec(this.ua)) ?? [])[1] ?? 'Unknown generic version'
    if (/rv:\d+/u.test(this.ua)) return ((/rv:[\d.]+/u.exec(this.ua)) ?? [])[1] ?? 'Unknown rv version'
    return 'Unknown version'
  }
}
