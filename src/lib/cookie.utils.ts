import { Logger } from './logger'

/**
 * Get a cookie value by name, using the CookieStore API when available and falling back to document.cookie
 * @param name the name of the cookie to read
 * @returns the cookie value or undefined if not found
 */
export async function getCookieValueByName(name: string): Promise<string | undefined> {
  // CookieStore is available - in more recent browser versions
  if (typeof globalThis !== 'undefined' && 'cookieStore' in globalThis)
    try {
      const cookie = await globalThis.cookieStore.get(name)
      if (cookie) return cookie.value
    } catch (error) {
      /* v8 ignore start */
      const logger = new Logger()
      logger.showError(error)
      /* v8 ignore stop */
    }

  // Fallback: parse document.cookie if cookieStore is not present - like in older versions of Firefox
  const cookies = globalThis.document.cookie.split(';')
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim(),
      separatorIndex = trimmedCookie.indexOf('=')

    /* v8 ignore start */
    if (separatorIndex === -1) continue

    const key = trimmedCookie.slice(0, separatorIndex),
      value = trimmedCookie.slice(separatorIndex + 1)
    if (key === name) return decodeURIComponent(value)

    /* v8 ignore stop */
  }
  return undefined
}
