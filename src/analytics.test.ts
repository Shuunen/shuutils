import { expect, it, mock } from 'bun:test'
import { createAnalytics } from './analytics'
import { Result } from './result'

it('analytics A defaults', () => {
  const analytics = createAnalytics()
  const track = Result.unwrap(analytics.track('event-test'))
  expect(track.value).toMatchInlineSnapshot(`"analytics : track event "event-test" for app "app-default""`)
  expect(track.error).toBeUndefined()
  const page = Result.unwrap(analytics.page())
  expect(page.value).toMatchInlineSnapshot(`"analytics : track page for app "app-default""`)
  expect(page.error).toBeUndefined()
  const identify = Result.unwrap(analytics.identify('id-test'))
  expect(identify.value).toMatchInlineSnapshot(`"analytics : identify user "id-test" on app "app-default""`)
  expect(identify.error).toBeUndefined()
})

it('analytics B with pile', () => {
  const analytics = createAnalytics({ app: 'unit-pile', willPile: true })
  analytics.track('event-name')
  analytics.page()
  analytics.identify('user-id')
  expect(analytics.pile.join(', ')).toMatchInlineSnapshot(`"track:event-name, page, identify:user-id"`)
})

it('analytics C with callbacks', () => {
  /* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-readonly-parameter-types, unicorn/no-useless-promise-resolve-reject */
  const onIdentify = mock(async (_userId: string, _additionalData?: Record<string, unknown>) => Promise.resolve())
  const onPage = mock(async () => Promise.resolve())
  const onTrack = mock(async (_event: string, _additionalData?: Record<string, unknown>) => Promise.resolve())
  /* eslint-enable @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-readonly-parameter-types, unicorn/no-useless-promise-resolve-reject */
  const analytics = createAnalytics({ app: 'unit-callbacks', onIdentify, onPage, onTrack })
  analytics.track('event-name')
  // eslint-disable-next-line unicorn/no-useless-undefined
  expect(onTrack).toHaveBeenNthCalledWith(1, 'event-name', undefined)
  analytics.track('event-alt', { year: 2025 })
  expect(onTrack).toHaveBeenNthCalledWith(2, 'event-alt', { year: 2025 })
  analytics.page()
  expect(onPage).toHaveBeenCalledTimes(1)
  analytics.identify('user-id')
  // eslint-disable-next-line unicorn/no-useless-undefined
  expect(onIdentify).toHaveBeenNthCalledWith(1, 'user-id', undefined)
  analytics.identify('user-id', { age: 35 })
  expect(onIdentify).toHaveBeenNthCalledWith(2, 'user-id', { age: 35 })
})

/*
it('analytics B error if identify without setup', () => {
  const analytics = createAnalytics()
  const result = Result.unwrap(analytics.identify('test'))
  expect(result.value).toMatchInlineSnapshot(`"analytics : "identify:test" added to pile"`)
  expect(result.error).toBeUndefined()
})

it('analytics C error if track page without setup', () => {
  const analytics = createAnalytics()
  const result = Result.unwrap(analytics.page())
  expect(result.value).toMatchInlineSnapshot(`"analytics : "page" added to pile"`)
  expect(result.error).toBeUndefined()
})

it('analytics D valid in memory', async () => {
  const analytics = createAnalytics()
  analytics.track('test-track-1')
  analytics.track('test-track-2')
  analytics.page()
  analytics.identify('test-identify')
  const result = Result.unwrap(analytics.identify('test-identify-2'))
  expect(result.value).toMatchInlineSnapshot(`"analytics : "identify:test-identify-2" added to pile"`)
  expect(result.error).toBeUndefined()
  await sleep(5)
  expect(analytics.pile.join(', ')).toMatchInlineSnapshot(`"track:test-track-1, track:test-track-2, page, identify:test-identify, identify:test-identify-2"`)
})
*/
// it('analytics E valid', async () => {
//   const analytics = new Analytics()
//   const mocks = {
//     /* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-readonly-parameter-types, unicorn/no-useless-promise-resolve-reject */
//     identify: mock(async (_userId: string, _additionalData?: Record<string, unknown>) => Promise.resolve()),
//     page: mock(async () => Promise.resolve()),
//     track: mock(async (_event: string, _additionalData?: Record<string, unknown>) => Promise.resolve()),
//     /* eslint-enable @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-readonly-parameter-types, unicorn/no-useless-promise-resolve-reject */
//   }
//   // @ts-expect-error for testing purposes
//   analytics.$instance = mocks
//   analytics.track('test-track-1')
//   expect(mocks.track).toHaveBeenNthCalledWith(1, 'test-track-1')
//   analytics.track('test-track-2')
//   analytics.page()
//   expect(mocks.page).toHaveBeenCalledTimes(1)
//   analytics.identify('test-identify')
//   expect(mocks.identify).toHaveBeenNthCalledWith(1, 'test-identify')
//   await sleep(5)
//   expect(analytics.pile.join(', ')).toMatchInlineSnapshot()
// })
