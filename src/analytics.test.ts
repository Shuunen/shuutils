import { expect, it } from 'vitest'
import { Analytics } from './analytics'
import { sleep } from './functions'

it('analytics A throw if track event without setup', () => {
  const analytics = new Analytics()
  expect(() => {
    analytics.track('test')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: analytics : track event failed, analytics not setup]`)
})

it('analytics B setupInMemory', async () => {
  const analytics = new Analytics()
  analytics.setupInMemory('unit-test-app')
  analytics.track('test-track-1')
  analytics.track('test-track-2')
  analytics.page()
  analytics.identify('test-identify')
  await sleep(10)
  expect(analytics.pile).toMatchInlineSnapshot(`
    [
      "track:test-track-1",
      "track:test-track-2",
      "page",
      "identify:test-identify",
    ]
  `)
})

it('analytics C throw if identify without setup', () => {
  const analytics = new Analytics()
  expect(() => {
    analytics.identify('test')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: analytics : identify failed, analytics not setup]`)
})

it('analytics D throw if track page without setup', () => {
  const analytics = new Analytics()
  expect(() => {
    analytics.page()
  }).toThrowErrorMatchingInlineSnapshot(`[Error: analytics : track page failed, analytics not setup]`)
})
