import { expect, it } from 'vitest'
import { BrowserScout } from '../src'

const scout = new BrowserScout()

it('browser-scout A instance in test context', () => {
  expect(scout).toMatchInlineSnapshot(`
    BrowserScout {
      "browser": "Unknown browser",
      "isIE": false,
      "isMobile": false,
      "language": "Undefined window language",
      "os": "Unknown OS",
      "platform": "Undefined window platform",
      "userAgent": "Undefined window userAgent",
      "version": "Unknown version",
    }
  `)
})
