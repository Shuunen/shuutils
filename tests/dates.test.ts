import { test } from 'uvu'
import { equal, ok } from 'uvu/assert'
import { dateIso10, dateToIsoString, daysAgo, daysAgoIso10, formatDate, readableTimeAgo } from '../src'
import { check } from './utils'

const today = new Date()

test('give a ISO 10 format', function () {
  const expected = '2018-11-30'
  equal(dateIso10(new Date(expected)), expected)
})

test('daysAgo give today by default', function () {
  // use dateIso10 to remove milliseconds that would differ from two new Date() instances
  equal(dateIso10(), dateIso10(daysAgo()))
})

test('daysAgoIso10 give today by default', function () {
  equal(daysAgoIso10(), dateIso10(today))
})

test('iso string date has length', function () {
  ok(dateToIsoString(new Date()).length > 0)
})

test('iso string date contains timezone by default', function () {
  ok(dateToIsoString(new Date()).toLowerCase().includes('z'))
})

test('iso string date does not contains timezone if needed', function () {
  ok(!dateToIsoString(new Date(), true).toLowerCase().includes('z'))
})

test('should calculate time ago correctly', function () {
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

const date = new Date('2021-09-02T07:08:28')
check('format date as (space) HH:mm:ss', formatDate(date, ' HH:mm:ss'), ' 07:08:28')
check('format date as d', formatDate(date, 'd'), '2')
check('format date as dd', formatDate(date, 'dd'), '02')
check('format date as dd/MM/yyyy HH:mm:ss', formatDate(date, 'dd/MM/yyyy HH:mm:ss'), '02/09/2021 07:08:28')
check('format date as dd/MM/yyyy', formatDate(date, 'dd/MM/yyyy'), '02/09/2021')
check('format date as eee d', formatDate(date, 'eee d'), 'Thu 2')
check('format date as eee', formatDate(date, 'eee'), 'Thu')
check('format date as eeee', formatDate(date, 'eeee'), 'Thursday')
check('format date as HH', formatDate(date, 'HH'), '07')
check('format date as mm', formatDate(date, 'mm'), '08')
check('format date as MM', formatDate(date, 'MM'), '09')
check('format date as MMMM', formatDate(date, 'MMMM'), 'September')
check('format date as ss', formatDate(date, 'ss'), '28')
check('format date as yy-MM-dd', formatDate(date, 'yy-MM-dd'), '21-09-02')
check('format date as yy', formatDate(date, 'yy'), '21')
check('format date as yyyy (space)', formatDate(date, 'yyyy '), '2021 ')
check('format date as yyyy', formatDate(date, 'yyyy'), '2021')

test.run()
