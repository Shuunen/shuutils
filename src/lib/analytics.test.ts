import { createAnalytics } from './analytics.ts'
import { Result } from './result.ts'

describe('analytics', () => {
  it('analytics A defaults', () => {
    const analytics = createAnalytics()
    const results = [analytics.track('event-test'), analytics.page(), analytics.identify('id-test')].map(result => Result.unwrap(result))
    expect(results.map(result => result.error)).toStrictEqual([undefined, undefined, undefined])
    expect(results.map(result => result.value)).toStrictEqual(['analytics : track event "event-test" for app "app-default"', 'analytics : track page for app "app-default"', 'analytics : identify user "id-test" on app "app-default"'])
  })

  it('analytics B with pile', () => {
    const analytics = createAnalytics({ app: 'unit-pile', pile: true })
    analytics.track('event-name')
    analytics.page()
    analytics.identify('user-id')
    expect(analytics.pile.join(', ')).toMatchInlineSnapshot(`"track:event-name, page, identify:user-id"`)
  })

  it('analytics C with callbacks', () => {
    const onIdentify = vi.fn<() => void>()
    const onPage = vi.fn<() => void>()
    const onTrack = vi.fn<() => void>()
    const analytics = createAnalytics({ app: 'unit-callbacks', onIdentify, onPage, onTrack })
    analytics.track('event-name')
    expect(onTrack).toHaveBeenNthCalledWith(1, 'event-name', undefined)
    analytics.track('event-alt', { year: 2025 })
    expect(onTrack).toHaveBeenNthCalledWith(2, 'event-alt', { year: 2025 })
    analytics.page()
    expect(onPage).toHaveBeenCalledOnce()
    analytics.identify('user-id')
    expect(onIdentify).toHaveBeenNthCalledWith(1, 'user-id', undefined)
    analytics.identify('user-id', { age: 35 })
    expect(onIdentify).toHaveBeenNthCalledWith(2, 'user-id', { age: 35 })
  })

  it('analytics D with log', () => {
    const analytics = createAnalytics({ log: true })
    const result = Result.unwrap(analytics.track('log-event'))
    expect(result.value).toContain('analytics : track event')
  })

  it('analytics E with pile and log', () => {
    const analytics = createAnalytics({ log: true, pile: true })
    analytics.track('event1')
    analytics.page()
    analytics.identify('user1')
    expect(analytics.pile).toStrictEqual(['track:event1', 'page', 'identify:user1'])
  })
})
