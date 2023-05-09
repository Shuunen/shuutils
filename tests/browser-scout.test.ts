import { expect, it } from 'vitest'
import { BrowserScout, getBrowser, getOperatingSystem, getVersion } from '../src'

const scout = new BrowserScout()

it('browser-scout A instance in test context', () => {
  expect(scout).toMatchInlineSnapshot(`
    BrowserScout {
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

it('browser-scout B report', () => {
  expect(scout.report()).toMatchInlineSnapshot(`
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
it('getBrowser A', () => { expect(getBrowser(userAgentA)).toMatchInlineSnapshot('"Chrome"') })
it('getVersion A', () => { expect(getVersion(userAgentA)).toMatchInlineSnapshot('"112.0.0.0"') })
it('getOperatingSystem A', () => { expect(getOperatingSystem(userAgentA)).toMatchInlineSnapshot('"Windows"') })

const userAgentB = 'Weird user agent'
it('getBrowser B', () => { expect(getBrowser(userAgentB)).toMatchInlineSnapshot('"Unknown browser"') })
it('getVersion B', () => { expect(getVersion(userAgentB)).toMatchInlineSnapshot('"Unknown version"') })
it('getOperatingSystem B', () => { expect(getOperatingSystem(userAgentB)).toMatchInlineSnapshot('"Unknown OS"') })

// Samsung Galaxy S22 Android 12
const userAgentC = 'Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36'
it('getBrowser C', () => { expect(getBrowser(userAgentC)).toMatchInlineSnapshot('"Chrome"') })
it('getVersion C', () => { expect(getVersion(userAgentC)).toMatchInlineSnapshot('"80.0.3987.119"') })
it('getOperatingSystem C', () => { expect(getOperatingSystem(userAgentC)).toMatchInlineSnapshot('"Android"') })

// iPhone 13 Pro Max iOS 15
const userAgentD = 'Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1'
it('getBrowser D', () => { expect(getBrowser(userAgentD)).toMatchInlineSnapshot('"Safari"') })
it('getVersion D', () => { expect(getVersion(userAgentD)).toMatchInlineSnapshot('"10.0"') })
it('getOperatingSystem D', () => { expect(getOperatingSystem(userAgentD)).toMatchInlineSnapshot('"iOS"') })

// Windows 10-based PC using Edge browser
const userAgentE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
it('getBrowser E', () => { expect(getBrowser(userAgentE)).toMatchInlineSnapshot('"Edge"') })
it('getVersion E', () => { expect(getVersion(userAgentE)).toMatchInlineSnapshot('"12.246"') })
it('getOperatingSystem E', () => { expect(getOperatingSystem(userAgentE)).toMatchInlineSnapshot('"Windows"') })

// Chrome OS-based laptop using Chrome browser (Chromebook)
const userAgentF = 'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36'
it('getBrowser F', () => { expect(getBrowser(userAgentF)).toMatchInlineSnapshot('"Chrome"') })
it('getVersion F', () => { expect(getVersion(userAgentF)).toMatchInlineSnapshot('"51.0.2704.64"') })
it('getOperatingSystem F', () => { expect(getOperatingSystem(userAgentF)).toMatchInlineSnapshot('"Chrome OS"') })

// Mac OS X-based computer using a Safari browser
const userAgentG = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
it('getBrowser G', () => { expect(getBrowser(userAgentG)).toMatchInlineSnapshot('"Safari"') })
it('getVersion G', () => { expect(getVersion(userAgentG)).toMatchInlineSnapshot('"9.0.2"') })
it('getOperatingSystem G', () => { expect(getOperatingSystem(userAgentG)).toMatchInlineSnapshot('"Mac OS"') })

// Linux-based PC using a Firefox browser
const userAgentH = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1'
it('getBrowser H', () => { expect(getBrowser(userAgentH)).toMatchInlineSnapshot('"Firefox"') })
it('getVersion H', () => { expect(getVersion(userAgentH)).toMatchInlineSnapshot('"15.0.1"') })
it('getOperatingSystem H', () => { expect(getOperatingSystem(userAgentH)).toMatchInlineSnapshot('"Linux"') })

// Internet Explorer 11
const userAgentI = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'
it('getBrowser I', () => { expect(getBrowser(userAgentI)).toMatchInlineSnapshot('"Internet Explorer"') })
it('getVersion I', () => { expect(getVersion(userAgentI)).toMatchInlineSnapshot('"11.0"') })
it('getOperatingSystem I', () => { expect(getOperatingSystem(userAgentI)).toMatchInlineSnapshot('"Windows"') })

// Internet Explorer 10
const userAgentJ = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'
it('getBrowser J', () => { expect(getBrowser(userAgentJ)).toMatchInlineSnapshot('"Internet Explorer"') })
it('getVersion J', () => { expect(getVersion(userAgentJ)).toMatchInlineSnapshot('"10.0"') })
it('getOperatingSystem J', () => { expect(getOperatingSystem(userAgentJ)).toMatchInlineSnapshot('"Windows"') })

