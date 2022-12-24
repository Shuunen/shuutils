import { check, checksRun, dateIso10, dateToIsoString, daysAgo, daysAgoIso10, formatDate, Nb, readableTime, readableTimeAgo } from '../src'

const today = new Date()

check('dateIso10 specific date', dateIso10(new Date('2018-11-30')), '2018-11-30')
check('dateIso10 today', dateIso10(today), today.toISOString().split('T')[0])

// use dateIso10 to remove milliseconds that would differ from two new Date() instances
check('daysAgo give today by default', dateIso10(), dateIso10(daysAgo()))

check('daysAgoIso10 give today by default', daysAgoIso10(), dateIso10(today))

check('iso string date has length', dateToIsoString(new Date()).length > 0, true)
check('iso string date contains timezone by default', dateToIsoString(new Date()).toLowerCase().includes('z'), true)
check('iso string date does not contains timezone if needed', dateToIsoString(new Date(), true).toLowerCase().includes('z'), false)

const samples = [
  [1000, '1 second ago'],
  [2500, '2 seconds ago'],
  [0, 'now'],
  [daysAgo(), 'now'],
  [10 * 1000, '10 seconds ago'],
  [59 * 1000, '59 seconds ago'],
  [60 * 1000, '1 minute ago'],
  [61 * 1000, '1 minute ago'],
  [119 * 1000, '1 minute ago'],
  [120 * 1000, '2 minutes ago'],
  [121 * 1000, '2 minutes ago'],
  [(60 ** 2 * 1000) - 1000, '59 minutes ago'],
  [1 * 60 * 60 * 1000, '1 hour ago'],
  [1.5 * 60 * 60 * 1000, '1 hour ago'],
  [2.5 * 60 * 60 * 1000, '2 hours ago'],
  [daysAgo(1), 'yesterday'],
  [daysAgo(2), '2 days ago'],
  [daysAgo(8), 'last week'],
  [daysAgo(15), '2 weeks ago'],
  [daysAgo(29), '4 weeks ago'],
  [daysAgo(35), 'last month'],
  [daysAgo(61), '2 months ago'],
  [daysAgo(364), '12 months ago'],
  [daysAgo(365), 'last year'],
]
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
samples.forEach(([input, expected], index) => { check(`should calculate time ago correctly (index ${index})`, readableTimeAgo(input as Date | number), expected) })

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

check('readable time A', readableTime(0), '0 millisecond')
check('readable time B', readableTime(Nb.MsInSecond), '1 second')
check('readable time C', readableTime(3 * Nb.MsInSecond), '3 seconds')
check('readable time D', readableTime(Nb.MsInMinute), '1 minute')
check('readable time E', readableTime(2 * Nb.MsInMinute), '2 minutes')
check('readable time F', readableTime(Nb.MsInHour), '1 hour')
check('readable time G', readableTime(3 * Nb.MsInDay, false), '3d')
check('readable time H', readableTime(Nb.MsInDay), '1 day')
check('readable time I', readableTime(42, false), '42ms')
check('readable time J', readableTime(42), '42 milliseconds')
check('readable time K', readableTime(2 * Nb.MsInHour), '2 hours')
check('readable time L', readableTime(3 * Nb.MsInDay), '3 days')
check('readable time M', readableTime(32 * Nb.MsInDay), '1 month')
check('readable time N', readableTime(2 * Nb.MsInYear), '2 years')
check('readable time O', readableTime(daysAgo(2)), '2 days')
check('readable time P', readableTime(daysAgo(4), false), '4d')

checksRun()

