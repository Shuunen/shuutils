/* eslint-disable no-console */
import { sleep } from './functions'
import { ellipsis } from './strings'
import type { NavigatorUserAgent } from './types'

/* c8 ignore start */

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 */
export async function copyToClipboard (stuff: Record<string, unknown> | Record<string, unknown>[] | string[] | number | string) {
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

/**
 * Default callback for onPageChange
 * @param location the new location
 */
export function onPageChangeDefaultCallback (location: string) {
  console.log(`location changed : ${location} but onPageChange callback is empty`)
}

/**
 * Detect location.href changes
 * @param callback the callback to call when location.href changes
 * @param wait the time to wait between each check, default 1000ms
 * @param last used for recursion, do not use it
 */
export async function onPageChange (callback = onPageChangeDefaultCallback, wait = 1000, last = '') {
  await sleep(wait)
  const current = document.location.href
  if (current !== last) callback(current)
  void onPageChange(callback, wait, current)
}

/**
 * Detect the browser context
 * @copyright inspired from Ben Brooks Scholz https://github.com/benbscholz/detect Copyright (C) 2011
 */
export class BrowserScout {

  public browser: 'Android' | 'Chrome' | 'Edge' | 'Firefox' | 'Internet Explorer' | 'iOS' | 'Safari' | 'Unknown browser' = 'Unknown browser'

  public isIE = false

  public isMobile = false

  public language = 'Unknown language'

  public os: 'Android' | 'ChromeOS' | 'iOS' | 'Linux' | 'Mac OS X' | 'Unknown OS' | 'Windows' = 'Unknown OS'

  public platform = 'Unknown platform'

  public userAgent = 'Unknown UA'

  public version = 'Unknown version'

  /**
   * BrowserScout constructor
   */
  public constructor () {
    this.detect()
  }

  /**
   * Return the navigator in a safe way for non-browser environments
   * @returns the navigator
   */
  public get navigator () {
    const extract = {
      userAgent: 'Undefined window userAgent',
      language: 'Undefined window language',
      platform: 'Undefined window platform',
    }
    /* c8 ignore next 6 */
    if (typeof window !== 'undefined') {
      extract.userAgent = window.navigator.userAgent
      extract.language = window.navigator.language
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      extract.platform = (window.navigator as NavigatorUserAgent).userAgentData?.platform ?? 'Unknown platform'
    }
    return extract
  }

  /**
   * Return the document in a safe way for non-browser environments
   * @returns the document
   */
  private get document () {
    /* c8 ignore next */
    if (typeof document !== 'undefined') return document
    return { documentElement: {} }
  }

  /**
   * Detect the browser context
   */
  private detect () {
    this.userAgent = this.navigator.userAgent
    this.platform = this.getPlatform()
    this.browser = this.getBrowser()
    this.isIE = this.browser === 'Internet Explorer'
    this.version = this.getVersion()
    this.os = this.getOperatingSystem()
    this.isMobile = this.detectMobile()
    this.language = this.navigator.language
  }

  /**
   * Detect if the browser is running on mobile
   * @returns true if the browser is running on mobile
   */
  private detectMobile () {
    if ('ontouchstart' in this.document.documentElement) return true
    if (this.userAgent.includes('Mobile')) return true
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (['Android'].includes(this.browser)) return true
    return false
  }

  /**
   * Get the browser name
   * @returns the browser name
   */
  private getBrowser () {
    if (this.userAgent.includes('MSIE') || (this.userAgent.includes('Mozilla') && this.userAgent.includes('Trident'))) return 'Internet Explorer'
    if (/edg/iu.test(this.userAgent)) return 'Edge'
    if (/chrome|chromium|crios/iu.test(this.userAgent)) return 'Chrome'
    if (/firefox|fxios/iu.test(this.userAgent)) return 'Firefox'
    if (/safari/iu.test(this.userAgent)) return 'Safari'
    if (/android/iu.test(this.userAgent)) return 'Android'
    if (/iphone/iu.test(this.userAgent)) return 'iOS'
    return 'Unknown browser'
  }

  /**
   * Get the operating system name
   * @returns the operating system name
   */
  private getOperatingSystem () {
    if (['Safari', 'iOS'].includes(this.browser)) return 'iOS'
    if (this.platform === 'MacIntel' || this.platform === 'MacPPC') return 'Mac OS X'
    if (this.platform === 'CrOS') return 'ChromeOS'
    if (this.platform === 'Win32' || this.platform === 'Win64' || this.userAgent.includes('Windows')) return 'Windows'
    if (this.userAgent.includes('Android')) return 'Android'
    if (this.platform.includes('Linux')) return 'Linux'
    return 'Unknown OS'
  }

  /**
   * Get the platform name
   * @returns the platform name
   */
  private getPlatform () {
    if (this.userAgent.includes('Chrome') && this.userAgent.includes('CrOS')) return 'CrOS'
    return this.navigator.platform
  }

  /**
   * Get the browser version
   * @returns the browser version
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity, complexity
  private getVersion () {
    if (this.userAgent.includes('MSIE')) return ((/MSIE [\d.]+/u.exec(this.userAgent)) ?? [])[1] ?? 'Unknown MSIE version'
    if (this.userAgent.includes('Chrome')) return ((/Chrome\/[\d.]+/u.exec(this.userAgent)) ?? [])[1] ?? 'Unknown Chrome version'
    if (this.userAgent.includes('Firefox')) return ((/Firefox\/[\d.]+/u.exec(this.userAgent)) ?? [])[1] ?? 'Unknown Firefox version'
    if (this.userAgent.includes('Version')) return ((/Version\/[\d.]+/u.exec(this.userAgent)) ?? [])[1] ?? 'Unknown generic version'
    if (/rv:\d+/u.test(this.userAgent)) return ((/rv:[\d.]+/u.exec(this.userAgent)) ?? [])[1] ?? 'Unknown rv version'
    return 'Unknown version'
  }
}

/* c8 ignore stop */
