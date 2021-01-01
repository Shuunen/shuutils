import { ok, strictEqual as equal } from 'assert'
import { dateIso10, dateToIsoString, daysAgo, daysAgoIso10 } from '../src'

describe('dates', () => {
  const today = new Date()

  it('give a ISO 10 format', () => {
    const expected = '2018-11-30'
    equal(dateIso10(new Date(expected)), expected)
  })

  it('daysAgo give today by default', () => {
    // use dateIso10 to remove milliseconds that would differ from two new Date() instances
    equal(dateIso10(), dateIso10(daysAgo()))
  })

  it('daysAgoIso10 give today by default', () => {
    equal(daysAgoIso10(), dateIso10(today))
  })

  it('iso string date has length', () => {
    ok(dateToIsoString(new Date()).length > 0)
  })

  it('iso string date contains timezone by default', () => {
    ok(dateToIsoString(new Date()).toLowerCase().includes('z'))
  })

  it('iso string date does not contains timezone if needed', () => {
    ok(!dateToIsoString(new Date(), true).toLowerCase().includes('z'))
  })
})
