import { nbMsInDay, nbMsInHour, nbMsInMinute, nbMsInMonth, nbMsInSecond, nbMsInWeek, nbMsInYear } from './constants'
import { dateIso10 } from './dates'

/**
 * Make a date readable for us, poor humans
 * Kudos to https://coolaj86.com/articles/time-ago-in-under-50-lines-of-javascript/
 * @param input a date or a number of milliseconds
 * @param language the language to use, default is "en"
 * @returns "a minute ago", "4 days ago"
 */
export function readableTimeAgo (input: Date | number, language = 'en') {
  const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' })
  const ms = typeof input === 'number' ? input : (Date.now() - input.getTime())
  if (ms < nbMsInMinute) return rtf.format(-Math.floor(ms / nbMsInSecond), 'second')
  if (ms < nbMsInHour) return rtf.format(-Math.floor(ms / nbMsInMinute), 'minute')
  if (ms < nbMsInDay) return rtf.format(-Math.floor(ms / nbMsInHour), 'hour')
  if (ms < nbMsInWeek) return rtf.format(-Math.floor(ms / nbMsInDay), 'day')
  if (ms < nbMsInMonth) return rtf.format(-Math.floor(ms / nbMsInWeek), 'week')
  if (ms < nbMsInYear) return rtf.format(-Math.floor(ms / nbMsInMonth), 'month')
  return rtf.format(-Math.floor(ms / nbMsInYear), 'year')
}

/**
 * Return a relative Date
 * @param nbDays the number of days to subtract from today
 * @returns a Date
 */
export function daysAgo (nbDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() - nbDays)
  return date
}

/**
 * Return a relative date formatted to ISO 10
 * @param nbDays the number of days to subtract from today
 * @returns a string like : "2019-12-31"
 */
export function daysAgoIso10 (nbDays = 0) {
  return dateIso10(daysAgo(nbDays))
}
