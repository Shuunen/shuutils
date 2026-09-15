import { alignForSnap } from './testing-align-for-snap'

// no happy-dom registration here on purpose : alignForSnap must not touch DOM globals that do not exist

describe('testing-align-for-snap without dom', () => {
  it('alignForSnap A array in a plain node environment', () => {
    expect(alignForSnap(['Date: 16/05/2024 17:36:32', 'plain'])).toBe('Date: xx/xx/xxxx xx:xx:xx | plain')
  })

  it('alignForSnap B object in a plain node environment', () => {
    expect(alignForSnap({ value: String.raw`\\documents\\file.pdf` })).toMatchInlineSnapshot(`
      "{
        "value": "/documents/file.pdf"
      }"
    `)
  })
})
