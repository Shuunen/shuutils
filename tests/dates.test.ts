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
      [1.5 * 24 * 60 * 60 * 1000, 'a day ago'],
      [2.5 * 24 * 60 * 60 * 1000, '2 days ago'],
      [7 * 24 * 60 * 60 * 1000, 'a week ago'],
      [14 * 24 * 60 * 60 * 1000, '2 weeks ago'],
      [27 * 24 * 60 * 60 * 1000, '3 weeks ago'],
      [28 * 24 * 60 * 60 * 1000, '4 weeks ago'],
      [29 * 24 * 60 * 60 * 1000, '4 weeks ago'],
      [1.5 * 30 * 24 * 60 * 60 * 1000, 'a month ago'],
      [2.5 * 30 * 24 * 60 * 60 * 1000, '2 months ago'],
      [(12 * 30 * 24 * 60 * 60 * 1000) + 1000, '12 months ago'],
      [13 * 30 * 24 * 60 * 60 * 1000, 'more than a year ago'],
    ].forEach(([time, expected]) => equal(readableTimeAgo(new Date(time)), expected))
  })
})
