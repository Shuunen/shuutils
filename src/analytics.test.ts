import { expect, it } from 'bun:test'
import { Analytics } from './analytics'
import { sleep } from './functions'
import { Result } from './result'

it('analytics A throw if track event without setup', () => {
  const analytics = new Analytics()
  const result = Result.unwrap(analytics.track('test'))
  expect(result.error).toMatchInlineSnapshot(`"analytics : track event failed, analytics not setup"`)
  expect(result.value).toBeUndefined()
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
  const result = Result.unwrap(analytics.identify('test'))
  expect(result.error).toMatchInlineSnapshot(`"analytics : identify failed, analytics not setup"`)
  expect(result.value).toBeUndefined()
})

it('analytics D throw if track page without setup', () => {
  const analytics = new Analytics()
  const result = Result.unwrap(analytics.page())
  expect(result.error).toMatchInlineSnapshot(`"analytics : track page failed, analytics not setup"`)
  expect(result.value).toBeUndefined()
})
