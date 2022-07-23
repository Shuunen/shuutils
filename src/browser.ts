import { sleep } from './functions'
import { ellipsis } from './strings'

/**
 * Copy data to the clipboard
 * @param stuff the data to copy
 */
export async function copyToClipboard (stuff: string | string[] | number | Record<string, unknown> | Record<string, unknown>[]): Promise<void> {
  const text = typeof stuff === 'string' ? stuff : JSON.stringify(stuff)
  console.log(`copying to clipboard : ${ellipsis(text)}`)
  await navigator.clipboard.writeText(text).then(() => {
    console.log('copy successful')
  }, () => {
    console.error('failed to copy to clipboard')
  })
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

/**
 * Detect location.href changes
 * @param callback the callback to call when location.href changes
 * @param wait the time to wait between each check, default 1000ms
 * @param last used for recursion, do not use it
 */
export const onPageChange = async (callback = (location: string): void => { console.log(`location changed : ${location} but onPageChange callback is empty`) }, wait = 1000, last = ''): Promise<void> => {
  await sleep(wait)
  const current = document.location.href
  if (current !== last) callback(current)
  onPageChange(callback, wait, current)
}

/**
 * Detect the browser context, inspired by this script : https://github.com/benbscholz/detect/blob/master/src/detect.js
 */
export class BrowserScout {
  browser: 'Internet Explorer' | 'Edge' | 'Chrome' | 'Opera' | 'Android' | 'Firefox' | 'Safari' | 'Unknown browser' = 'Unknown browser'
  isIE = false
  language = 'Unknown language'
  os: 'Android' | 'iOS' | 'Mac OS X' | 'ChromeOS' | 'Windows' | 'Linux' | 'Unknown OS' = 'Unknown OS'
  platform: 'Unknown platform' | string = 'Unknown platform'
  ua: 'Unknown UA' | string = 'Unknown UA'
  version: 'Unknown version' | string = 'Unknown version'

  /**
   * Return the navigator in a safe way for non-browser environments
   * @returns {NavigatorExtract} the navigator
   */
  get navigator (): NavigatorExtract {
    const extract = {
      userAgent: 'Undefined window userAgent',
      language: 'Undefined window language',
      platform: 'Undefined window platform',
    }
    if (typeof window !== 'undefined') {
      extract.userAgent = window.navigator.userAgent
      extract.language = window.navigator.language
      extract.platform = (window.navigator as NavigatorUA).userAgentData?.platform ?? window.navigator.platform ?? 'Unknown platform'
    }
    return extract
  }

  /**
   * BrowserScout constructor
   */
  constructor () {
    this.detect()
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
    this.os = this.getOS()
    this.language = this.navigator.language
  }

  /**
   * Get the browser name
   * @returns {string} the browser name
   */
  private getBrowser (): this['browser'] {
    if (/MSIE/.test(this.ua) || (/Mozilla/.test(this.ua) && /Trident/.test(this.ua))) return 'Internet Explorer'
    if (/Edg/.test(this.ua)) return 'Edge'
    if (/Chrome/.test(this.ua)) return 'Chrome'
    if (/Opera/.test(this.ua)) return 'Opera'
    if (/Android/.test(this.ua)) return 'Android'
    if (/Firefox/.test(this.ua)) return 'Firefox'
    if (/Safari/.test(this.ua)) return 'Safari'
    return 'Unknown browser'
  }

  /**
   * Get the operating system name
   * @returns {string} the operating system name
   */
  private getOS (): this['os'] {
    if (/Safari/.test(this.ua) && (/iPhone/.test(this.ua) || /iPad/.test(this.ua) || /iPod/.test(this.ua))) return 'iOS'
    if (this.platform === 'MacIntel' || this.platform === 'MacPPC') return 'Mac OS X'
    if (this.platform === 'CrOS') return 'ChromeOS'
    if (this.platform === 'Win32' || this.platform === 'Win64' || /Windows/.test(this.ua)) return 'Windows'
    if (/Android/.test(this.ua)) return 'Android'
    if (/Linux/.test(this.platform)) return 'Linux'
    return 'Unknown OS'
  }

  /**
   * Get the platform name
   * @returns {string} the platform name
   */
  private getPlatform (): this['platform'] {
    if (/Chrome/.test(this.ua) && /CrOS/.test(this.ua)) return 'CrOS'
    return this.navigator.platform
  }

  /**
   * Get the browser version
   * @returns {string} the browser version
   */
  private getVersion (): this['version'] {
    if (/MSIE/.test(this.ua)) return (this.ua.match(/MSIE ([\d.]+)/) ?? [])[1] ?? 'Unknown MSIE version'
    if (/Chrome/.test(this.ua)) return (this.ua.match(/Chrome\/([\d.]+)/) ?? [])[1] ?? 'Unknown Chrome version'
    if (/Firefox/.test(this.ua)) return (this.ua.match(/Firefox\/([\d.]+)/) ?? [])[1] ?? 'Unknown Firefox version'
    if (/Version/.test(this.ua)) return (this.ua.match(/Version\/([\d.]+)/) ?? [])[1] ?? 'Unknown generic version'
    if (/rv:(\d+)/.test(this.ua)) return (this.ua.match(/rv:([\d.]+)/) ?? [])[1] ?? 'Unknown rv version'
    return 'Unknown version'
  }
}

interface NavigatorExtract {
  language: string
  platform: string
  userAgent: string
}

// below types from https://github.com/lukewarlow/user-agent-data-types/blob/master/index.d.ts
declare interface NavigatorUA {
  readonly userAgentData?: NavigatorUAData
}

interface NavigatorUABrandVersion {
  readonly brand: string
  readonly version: string
}

interface UADataValues {
  readonly architecture?: string
  readonly bitness?: string
  readonly brands?: NavigatorUABrandVersion[]
  readonly mobile?: boolean
  readonly model?: string
  readonly platform?: string
  readonly platformVersion?: string
  readonly uaFullVersion?: string
}

interface UALowEntropyJSON {
  readonly brands: NavigatorUABrandVersion[]
  readonly mobile: boolean
  readonly platform: string
}

interface NavigatorUAData extends UALowEntropyJSON {
  getHighEntropyValues (hints: string[]): Promise<UADataValues>
  toJSON (): UALowEntropyJSON
}
