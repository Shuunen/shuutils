import { ok, strictEqual as equal } from 'assert'
import { dateIso10, dateToIsoString, daysAgo, daysAgoIso10, readableTimeAgo } from '../src'

describe('dates', function () {
  const today = new Date()

  it('give a ISO 10 format', function () {
    const expected = '2018-11-30'
    equal(dateIso10(new Date(expected)), expected)
  })

  it('daysAgo give today by default', function () {
    // use dateIso10 to remove milliseconds that would differ from two new Date() instances
    equal(dateIso10(), dateIso10(daysAgo()))
  })

  it('daysAgoIso10 give today by default', function () {
    equal(daysAgoIso10(), dateIso10(today))
  })

  it('iso string date has length', function () {
    ok(dateToIsoString(new Date()).length > 0)
  })

  it('iso string date contains timezone by default', function () {
    ok(dateToIsoString(new Date()).toLowerCase().includes('z'))
  })

  it('iso string date does not contains timezone if needed', function () {
    ok(!dateToIsoString(new Date(), true).toLowerCase().includes('z'))
  })

  it('should calculate time ago correctly', function () {
    [
      [1.5 * 1000, 'a moment ago'],
      [daysAgo(), 'a moment ago'],
      [10 * 1000, '10 seconds ago'],
      [59 * 1000, '59 seconds ago'],
      [60 * 1000, 'a minute ago'],
      [61 * 1000, 'a minute ago'],
      [119 * 1000, 'a minute ago'],
      [120 * 1000, '2 minutes ago'],
      [121 * 1000, '2 minutes ago'],
      [(60 * 60 * 1000) - 1000, '59 minutes ago'],
      [1 * 60 * 60 * 1000, 'an hour ago'],
      [1.5 * 60 * 60 * 1000, 'an hour ago'],
      [2.5 * 60 * 60 * 1000, '2 hours ago'],
      [daysAgo(1), 'a day ago'],
      [daysAgo(2), '2 days ago'],
      [daysAgo(8), 'a week ago'],
      [daysAgo(15), '2 weeks ago'],
      [daysAgo(29), '4 weeks ago'],
      [daysAgo(35), 'a month ago'],
      [daysAgo(61), '2 months ago'],
      [daysAgo(364), '12 months ago'],
      [daysAgo(365), 'more than a year ago'],
    ].forEach(([input, expected]) => equal(readableTimeAgo(input as number | Date), expected))
  })
})
