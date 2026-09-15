import { browserContext, browserReport, getBrowser, getOperatingSystem, getVersion, isMobile } from './browser-scout'

const context = browserContext()

test('browser-scout A instance in test context', () => {
  expect(context).toMatchInlineSnapshot(`
    {
      "browser": "Unknown browser",
      "isInternetExplorer": false,
      "isMobile": false,
      "language": "Unknown language",
      "os": "Unknown OS",
      "platform": "Unknown platform",
      "screenHeight": 0,
      "screenWidth": 0,
      "url": "Unknown url",
      "userAgent": "Unknown user agent",
      "version": "Unknown version",
    }
  `)
})

test('browser-scout B report', () => {
  expect(browserReport(context)).toMatchInlineSnapshot(`
    "
     - Browser : Unknown browser Unknown version
     - Language : Unknown language
     - OS : Unknown OS
     - Platform : Unknown platform
     - Is mobile : false
     - Screen : 0x0
     - Url : Unknown url
     - User agent : Unknown user agent
     "
  `)
})

// Chrome 112 desktop Windows 10 x64
const userAgentA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'

test('getBrowser A', () => {
  expect(getBrowser(userAgentA)).toMatchInlineSnapshot('"Chrome"')
})

test('getVersion A', () => {
  expect(getVersion(userAgentA)).toMatchInlineSnapshot('"112.0.0.0"')
})

test('getOperatingSystem A', () => {
  expect(getOperatingSystem(userAgentA)).toMatchInlineSnapshot('"Windows"')
})

test('isMobile A', () => {
  expect(isMobile(userAgentA)).toBe(false)
})

const userAgentB = 'Weird user agent'

test('getBrowser B', () => {
  expect(getBrowser(userAgentB)).toMatchInlineSnapshot('"Unknown browser"')
})

test('getVersion B', () => {
  expect(getVersion(userAgentB)).toMatchInlineSnapshot('"Unknown version"')
})

test('getOperatingSystem B', () => {
  expect(getOperatingSystem(userAgentB)).toMatchInlineSnapshot('"Unknown OS"')
})

test('isMobile B', () => {
  expect(isMobile(userAgentB)).toBe(false)
})

// Samsung Galaxy S22 Android 12
const userAgentC = 'Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36'

test('getBrowser C', () => {
  expect(getBrowser(userAgentC)).toMatchInlineSnapshot('"Chrome"')
})

test('getVersion C', () => {
  expect(getVersion(userAgentC)).toMatchInlineSnapshot('"80.0.3987.119"')
})

test('getOperatingSystem C', () => {
  expect(getOperatingSystem(userAgentC)).toMatchInlineSnapshot('"Android"')
})

test('isMobile C', () => {
  expect(isMobile(userAgentC)).toBe(true)
})

// iPhone 13 Pro Max iOS 15
const userAgentD = 'Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1'

test('getBrowser D', () => {
  expect(getBrowser(userAgentD)).toMatchInlineSnapshot('"Safari"')
})

test('getVersion D', () => {
  expect(getVersion(userAgentD)).toMatchInlineSnapshot('"10.0"')
})

test('getOperatingSystem D', () => {
  expect(getOperatingSystem(userAgentD)).toMatchInlineSnapshot('"iOS"')
})

test('isMobile D', () => {
  expect(isMobile(userAgentD)).toBe(true)
})

// Windows 10-based PC using Edge browser
const userAgentE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'

test('getBrowser E', () => {
  expect(getBrowser(userAgentE)).toMatchInlineSnapshot('"Edge"')
})

test('getVersion E', () => {
  expect(getVersion(userAgentE)).toMatchInlineSnapshot('"12.246"')
})

test('getOperatingSystem E', () => {
  expect(getOperatingSystem(userAgentE)).toMatchInlineSnapshot('"Windows"')
})

test('isMobile E', () => {
  expect(isMobile(userAgentE)).toBe(false)
})

// Chrome OS-based laptop using Chrome browser (Chromebook)
const userAgentF = 'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36'

test('getBrowser F', () => {
  expect(getBrowser(userAgentF)).toMatchInlineSnapshot('"Chrome"')
})

test('getVersion F', () => {
  expect(getVersion(userAgentF)).toMatchInlineSnapshot('"51.0.2704.64"')
})

test('getOperatingSystem F', () => {
  expect(getOperatingSystem(userAgentF)).toMatchInlineSnapshot('"Chrome OS"')
})

test('isMobile F', () => {
  expect(isMobile(userAgentF)).toBe(false)
})

// Mac OS X-based computer using a Safari browser
const userAgentG = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'

test('getBrowser G', () => {
  expect(getBrowser(userAgentG)).toMatchInlineSnapshot('"Safari"')
})

test('getVersion G', () => {
  expect(getVersion(userAgentG)).toMatchInlineSnapshot('"9.0.2"')
})

test('getOperatingSystem G', () => {
  expect(getOperatingSystem(userAgentG)).toMatchInlineSnapshot('"Mac OS"')
})

test('isMobile G', () => {
  expect(isMobile(userAgentG)).toBe(false)
})

// Linux-based PC using a Firefox browser
const userAgentH = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1'

test('getBrowser H', () => {
  expect(getBrowser(userAgentH)).toMatchInlineSnapshot('"Firefox"')
})

test('getVersion H', () => {
  expect(getVersion(userAgentH)).toMatchInlineSnapshot('"15.0.1"')
})

test('getOperatingSystem H', () => {
  expect(getOperatingSystem(userAgentH)).toMatchInlineSnapshot('"Linux"')
})

test('isMobile H', () => {
  expect(isMobile(userAgentH)).toBe(false)
})

// Internet Explorer 11
const userAgentI = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'

test('getBrowser I', () => {
  expect(getBrowser(userAgentI)).toMatchInlineSnapshot('"Internet Explorer"')
})

test('getVersion I', () => {
  expect(getVersion(userAgentI)).toMatchInlineSnapshot('"11.0"')
})

test('getOperatingSystem I', () => {
  expect(getOperatingSystem(userAgentI)).toMatchInlineSnapshot('"Windows"')
})

test('isMobile I', () => {
  expect(isMobile(userAgentI)).toBe(false)
})

// Internet Explorer 10
const userAgentJ = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'

test('getBrowser J', () => {
  expect(getBrowser(userAgentJ)).toMatchInlineSnapshot('"Internet Explorer"')
})

test('getVersion J', () => {
  expect(getVersion(userAgentJ)).toMatchInlineSnapshot('"10.0"')
})

test('getOperatingSystem J', () => {
  expect(getOperatingSystem(userAgentJ)).toMatchInlineSnapshot('"Windows"')
})

test('isMobile J', () => {
  expect(isMobile(userAgentJ)).toBe(false)
})

test('getVersion K should handle regex match without version group', () => {
  const userAgentK = 'TestBrowser/NoVersion'
  expect(getVersion(userAgentK)).toBe('Unknown version')
})

test('getBrowser with no match returns Unknown browser', () => {
  // An empty string should match the catch-all /./u regex
  const result = getBrowser('')
  expect(result).toBe('Unknown browser')
})

test('getOperatingSystem with no match returns Unknown OS', () => {
  // An empty string should match the catch-all /./u regex
  const result = getOperatingSystem('')
  expect(result).toBe('Unknown OS')
})

test('browserContext should return valid context object', () => {
  const ctx = browserContext()
  expect(ctx).toHaveProperty('browser')
  expect(ctx).toHaveProperty('isInternetExplorer')
  expect(ctx).toHaveProperty('isMobile')
  expect(ctx).toHaveProperty('language')
  expect(ctx).toHaveProperty('os')
  expect(ctx).toHaveProperty('platform')
  expect(ctx).toHaveProperty('screenHeight')
  expect(ctx).toHaveProperty('screenWidth')
  expect(ctx).toHaveProperty('url')
  expect(ctx).toHaveProperty('userAgent')
  expect(ctx).toHaveProperty('version')
})
