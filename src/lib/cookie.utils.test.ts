import { GlobalRegistrator } from '@happy-dom/global-registrator'
// oxlint-disable typescript/unbound-method
// oxlint-disable unicorn/no-document-cookie - we want to create the cookies manually
import { getCookieValueByName } from './cookie.utils'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register({ url: 'https://localhost/' })

// Mock unused CookieStore common methods to comply with typing
const cookieStoreCommonMock = {
  onchange: vi.fn<(...args: unknown[]) => void>(),
  delete: vi.fn<(...args: unknown[]) => Promise<void>>(),
  // oxlint-disable-next-line typescript/no-explicit-any
  getAll: vi.fn<(...args: unknown[]) => Promise<any>>(),
  set: vi.fn<(...args: unknown[]) => Promise<void>>(),
  addEventListener: vi.fn<(...args: unknown[]) => void>(),
  removeEventListener: vi.fn<(...args: unknown[]) => void>(),
  dispatchEvent: vi.fn<(...args: unknown[]) => boolean>(),
}

// We need this helper function to clear all cookies before each test and ensure isolation
function clearAllCookies() {
  const allCookiesString = globalThis.document.cookie
  if (!allCookiesString) return

  const separateCookies = allCookiesString.split(';')
  for (let singleCookie of separateCookies) {
    if (!singleCookie) continue

    singleCookie = singleCookie.trim()
    const position = singleCookie.indexOf('=')
    let cookieName = ''
    if (position === -1) cookieName = singleCookie
    else cookieName = singleCookie.slice(0, position).trim()

    globalThis.document.cookie = `${cookieName}=; expires=${new Date(0).toUTCString()}; path=/;`
  }
}

describe('cookie.utils.test getCookieValueByName', () => {
  const cookiePath = 'path=/',
    decodedMockCookieValue = 'foobar 2025',
    encodedMockCookieValue = 'foobar%202025',
    mockCookieName = 'test_cookie',
    notMockCookieName = 'not_test_cookie',
    stringMockCookieValue = 'foobar2025'

  beforeEach(() => {
    Reflect.deleteProperty(globalThis, 'cookieStore')
    clearAllCookies()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return string value from cookieStore when available', async () => {
    const mockCookie = { name: mockCookieName, value: stringMockCookieValue }
    // Mock cookieStore
    globalThis.cookieStore = {
      ...cookieStoreCommonMock,
      get: vi.fn<() => Promise<typeof mockCookie>>().mockResolvedValue(mockCookie),
    }
    const result = await getCookieValueByName(mockCookieName)
    expect(result).toBe(stringMockCookieValue)
    expect(globalThis.cookieStore.get).toHaveBeenCalledWith(mockCookieName)
  })

  it('should return undefined if cookie not found in cookieStore', async () => {
    // Mock cookieStore
    globalThis.cookieStore = {
      ...cookieStoreCommonMock,
      // oxlint-disable-next-line typescript/no-explicit-any
      get: vi.fn<() => Promise<any>>().mockResolvedValue(undefined),
    }
    const result = await getCookieValueByName(notMockCookieName)
    expect(result).toBeUndefined()
    expect(globalThis.cookieStore.get).toHaveBeenCalledWith(notMockCookieName)
  })

  it('should fallback to document.cookie when cookieStore throws', async () => {
    // Mock cookieStore
    globalThis.cookieStore = {
      ...cookieStoreCommonMock,
      get: vi.fn<() => Promise<Error>>().mockRejectedValue(new Error('Oops, CookieStore failed unexpectedly!')),
    }
    // Set cookie via document.cookie
    globalThis.document.cookie = `${mockCookieName}=${stringMockCookieValue}; ${cookiePath};`
    const result = await getCookieValueByName(mockCookieName)
    expect(result).toBe(stringMockCookieValue) // ------
  })

  it('should fallback to document.cookie when cookieStore is not available', async () => {
    // Set cookie via document.cookie with string value
    globalThis.document.cookie = `${mockCookieName}=${stringMockCookieValue}; ${cookiePath};`
    const result = await getCookieValueByName(mockCookieName)
    expect(result).toBe(stringMockCookieValue) //------
  })

  it('should decode URI-encoded values from document.cookie', async () => {
    // Set cookie via document.cookie with URI encoded value
    globalThis.document.cookie = `${mockCookieName}=${encodedMockCookieValue}; ${cookiePath};`
    const result = await getCookieValueByName(mockCookieName)
    expect(result).toBe(decodedMockCookieValue) // -------
  })

  it('should handle empty document.cookie', async () => {
    // We are not setting any cookie so it should be an empty string
    expect(globalThis.document.cookie).toBe('')
    const result = await getCookieValueByName(mockCookieName)
    expect(result).toBeUndefined()
  })

  it('should return undefined when cookie is not found in document.cookie', async () => {
    // Set a cookie with another name via document.cookie
    globalThis.document.cookie = `${notMockCookieName}=${stringMockCookieValue}; ${cookiePath};`
    const result = await getCookieValueByName(mockCookieName)
    expect(result).toBeUndefined()
  })

  it('should handle malformed cookies gracefully', async () => {
    // Intentionally set a malformed cookie by not providing the value, or the =
    globalThis.document.cookie = `${mockCookieName}; ${cookiePath};`
    const result = await getCookieValueByName(mockCookieName)
    expect(result).toBeUndefined()
  })
})
