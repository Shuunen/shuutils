import { isBrowserEnvironment } from './environment'
import type { NavigatorUserAgent } from './types'

/* c8 ignore start */

/* eslint-disable @typescript-eslint/naming-convention, perfectionist/sort-objects */
const browsers = {
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Edge: /edge/iu, // keep me first
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Chrome: /chrome|chromium|crios/iu,
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Firefox: /firefox|fxios/iu,
  'Internet Explorer': /msie|trident/iu,
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Safari: /safari/iu,
  'Unknown browser': /./u, // keep me last
} as const
const operatingSystems = {
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Android: /android/iu,
  'Chrome OS': /CrOS/iu,
  // biome-ignore lint/style/useNamingConvention: <explanation>
  iOS: /iphone/iu,
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Linux: /linux/iu,
  'Mac OS': /MacIntel|Macintosh|MacPPC/iu,
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Windows: /Win32|Win64|Windows/iu,
  'Unknown OS': /./u, // keep me last
} as const
const versions = {
  // biome-ignore lint/style/useNamingConvention: <explanation>
  MSIE: /MSIE (?<version>[\d.]+)/iu,
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Edge: /Edge\/(?<version>[\d.]+)/iu,
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Chrome: /Chrome\/(?<version>[\d.]+)/iu,
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Firefox: /Firefox\/(?<version>[\d.]+)/iu,
  generic: /Version\/(?<version>[\d.]+)/iu,
  rv: /rv:(?<version>[\d.]+)/iu,
}
/* eslint-enable @typescript-eslint/naming-convention, perfectionist/sort-objects */

type BrowserContext = Readonly<{
  browser: keyof typeof browsers
  isInternetExplorer: boolean
  isMobile: boolean
  language: string
  os: keyof typeof operatingSystems
  platform: string
  screenHeight: number
  screenWidth: number
  url: string
  userAgent: string
  version: string
}>

/**
 * Get the user agent string
 * @returns the user agent string
 */
export function getUserAgent() {
  return isBrowserEnvironment() ? globalThis.navigator.userAgent : 'Unknown user agent'
}

/**
 * Get the browser version from a user agent string
 * @param userAgent the user agent string to parse
 * @returns the browser version
 */
export function getVersion(userAgent = getUserAgent()) {
  for (const [browser, regex] of Object.entries(versions)) if (regex.test(userAgent)) return regex.exec(userAgent)?.groups?.version ?? `Unknown ${browser} version`
  return 'Unknown version'
}

/**
 * Get the browser name from a user agent string
 * @param userAgent the user agent string to parse
 * @returns the browser name
 */
export function getBrowser(userAgent = getUserAgent()) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
  for (const [browser, regex] of Object.entries(browsers)) if (regex.test(userAgent)) return browser as keyof typeof browsers
  return 'Unknown browser'
}

/**
 * Get the operating system name from a user agent string
 * @param userAgent the user agent string to parse
 * @returns the operating system name
 */
export function getOperatingSystem(userAgent = getUserAgent()) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
  for (const [os, regex] of Object.entries(operatingSystems)) if (regex.test(userAgent)) return os as keyof typeof operatingSystems
  return 'Unknown OS'
}

/**
 * Detect if the browser is running on mobile
 * @param userAgent the user agent like 'Mozilla/5.0...'
 * @returns true if the browser is running on mobile
 */
export function isMobile(userAgent = getUserAgent()) {
  if ('ontouchstart' in (typeof document === 'undefined' ? {} : document.documentElement)) return true
  if (userAgent.includes('Mobile')) return true
  const browser = getBrowser(userAgent)
  return ['Android'].includes(browser)
}

/**
 * Return a report of the browser context
 * @param context the browser context like { browser: 'Chrome', version: '91.0.4472', ... }
 * @returns a textual report like : - Browser: Chrome 91.0.4472 - Language: en-US...
 */
export function browserReport(context: BrowserContext) {
  return `
 - Browser : ${context.browser} ${context.version}
 - Language : ${context.language}
 - OS : ${context.os}
 - Platform : ${context.platform}
 - Is mobile : ${String(context.isMobile)}
 - Screen : ${context.screenWidth}x${context.screenHeight}
 - Url : ${context.url}
 - User agent : ${context.userAgent}
 `
}

/**
 * Detect the browser context
 * @returns the context like : { browser: 'Chrome', version: '91.0.4472', ... }
 * @copyright inspired from Ben Brooks Scholz https://github.com/benbscholz/detect Copyright (C) 2011
 */
export function browserContext() {
  const isBrowser = isBrowserEnvironment()
  const userAgent = getUserAgent()
  const browser = getBrowser(userAgent)
  return {
    browser,
    isInternetExplorer: browser === 'Internet Explorer',
    isMobile: isMobile(userAgent),
    language: isBrowser ? globalThis.navigator.language : 'Unknown language',
    os: getOperatingSystem(userAgent),
    platform: isBrowser ? ((globalThis.navigator as NavigatorUserAgent).userAgentData?.platform ?? 'Unknown platform') : 'Unknown platform', // eslint-disable-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
    screenHeight: isBrowser ? globalThis.screen.height : 0,
    screenWidth: isBrowser ? globalThis.screen.width : 0,
    url: isBrowser ? globalThis.location.href : 'Unknown url',
    userAgent,
    version: getVersion(userAgent),
  } satisfies BrowserContext
}
