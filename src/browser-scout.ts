import type { NavigatorUserAgent } from './types'

/* c8 ignore start */

/* eslint-disable @typescript-eslint/naming-convention, regexp/letter-case, perfectionist/sort-objects */
const browsers = {
  'Edge': /edge/iu, // keep me first
  'Chrome': /chrome|chromium|crios/iu,
  'Firefox': /firefox|fxios/iu,
  'Internet Explorer': /msie|trident/iu,
  'Safari': /safari/iu,
  'Unknown browser': /./u, // keep me last
} as const
const operatingSystems = {
  'Android': /android/iu,
  'Chrome OS': /CrOS/iu,
  'iOS': /iphone/iu,
  'Linux': /linux/iu,
  'Mac OS': /MacIntel|Macintosh|MacPPC/iu,
  'Windows': /Win32|Win64|Windows/iu,
  'Unknown OS': /./u, // keep me last
} as const
const versions = {
  MSIE: /MSIE (?<version>[\d.]+)/iu,
  Edge: /Edge\/(?<version>[\d.]+)/iu,
  Chrome: /Chrome\/(?<version>[\d.]+)/iu,
  Firefox: /Firefox\/(?<version>[\d.]+)/iu,
  generic: /Version\/(?<version>[\d.]+)/iu,
  rv: /rv:(?<version>[\d.]+)/iu,
}
/* eslint-enable @typescript-eslint/naming-convention, regexp/letter-case, perfectionist/sort-objects */

/**
 * Get the browser version from a user agent string
 * @param userAgent the user agent string to parse
 * @returns the browser version
 */
export function getVersion (userAgent: string) {
  for (const [browser, regex] of Object.entries(versions)) if (regex.test(userAgent)) return regex.exec(userAgent)?.groups?.version ?? `Unknown ${browser} version`
  return 'Unknown version'
}

/**
 * Get the browser name from a user agent string
 * @param userAgent the user agent string to parse
 * @returns the browser name
 */
export function getBrowser (userAgent: string) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  for (const [browser, regex] of Object.entries(browsers)) if (regex.test(userAgent)) return browser as keyof typeof browsers
  return 'Unknown browser'
}

/**
 * Get the operating system name from a user agent string
 * @param userAgent the user agent string to parse
 * @returns the operating system name
 */
export function getOperatingSystem (userAgent: string) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  for (const [os, regex] of Object.entries(operatingSystems)) if (regex.test(userAgent)) return os as keyof typeof operatingSystems
  return 'Unknown OS'
}

/**
 * Detect the browser context
 * @copyright inspired from Ben Brooks Scholz https://github.com/benbscholz/detect Copyright (C) 2011
 */
export class BrowserScout {

  public browser: keyof typeof browsers = 'Unknown browser'
  public isInternetExplorer = false
  public isMobile = false
  public language = typeof window === 'undefined' ? 'Unknown language' : window.navigator.language
  public os: keyof typeof operatingSystems = 'Unknown OS'
  public platform = typeof window === 'undefined' ? 'Unknown platform' : ((window.navigator as NavigatorUserAgent).userAgentData?.platform ?? 'Unknown platform') // eslint-disable-line @typescript-eslint/consistent-type-assertions
  public screenHeight = typeof window === 'undefined' ? 0 : window.screen.height
  public screenWidth = typeof window === 'undefined' ? 0 : window.screen.width
  public url = typeof window === 'undefined' ? 'Unknown url' : window.location.href
  public userAgent = typeof window === 'undefined' ? 'Unknown user agent' : window.navigator.userAgent
  public version = 'Unknown version'

  /**
   * BrowserScout constructor
   */
  public constructor () {
    this.browser = getBrowser(this.userAgent)
    this.isInternetExplorer = this.browser === 'Internet Explorer'
    this.version = getVersion(this.userAgent)
    this.os = getOperatingSystem(this.userAgent)
    this.isMobile = this.detectMobile()
  }

  /**
   * Return a report of the browser context
   * @returns a textual report like
   * - Browser: Chrome 91.0.4472.114
   * - Language: en-US
   * - OS: Windows
   * - Platform: Win32
   * - Screen : 1920x1080
   * - Url : https://www.example.com/
   */
  public report () {
    return `
    - Browser : ${this.browser} ${this.version}
    - Language : ${this.language}
    - OS : ${this.os}
    - Platform : ${this.platform}
    - Is mobile : ${String(this.isMobile)}
    - Screen : ${this.screenWidth}x${this.screenHeight}
    - Url : ${this.url}
    - User agent : ${this.userAgent}
    `
  }

  /**
   * Detect if the browser is running on mobile
   * @returns true if the browser is running on mobile
   */
  private detectMobile () {
    if ('ontouchstart' in (typeof document === 'undefined' ? {} : document.documentElement)) return true
    if (this.userAgent.includes('Mobile')) return true
    return ['Android'].includes(this.browser)
  }
}

/* c8 ignore stop */
