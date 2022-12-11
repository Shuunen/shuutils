import { msInDay, msInHour, msInMinute, msInMonth, msInSecond, msInWeek, msInYear } from './constants'
import { dateIso10 } from './dates'

/**
 * Make a date readable for us, poor humans
 * Kudos to https://coolaj86.com/articles/time-ago-in-under-50-lines-of-javascript/
 * @param input a date or a number of milliseconds
 * @param language the language to use, default is "en"
 * @returns "a minute ago", "4 days ago"
 */
export function readableTimeAgo (input: Date | number, language = 'en'): string {
  const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' })
  const ms = typeof input === 'number' ? input : (Date.now() - input.getTime())
  if (ms < msInMinute) return rtf.format(-Math.floor(ms / msInSecond), 'second')
  if (ms < msInHour) return rtf.format(-Math.floor(ms / msInMinute), 'minute')
  if (ms < msInDay) return rtf.format(-Math.floor(ms / msInHour), 'hour')
  if (ms < msInWeek) return rtf.format(-Math.floor(ms / msInDay), 'day')
  if (ms < msInMonth) return rtf.format(-Math.floor(ms / msInWeek), 'week')
  if (ms < msInYear) return rtf.format(-Math.floor(ms / msInMonth), 'month')
  return rtf.format(-Math.floor(ms / msInYear), 'year')
}

/**
 * Return a relative Date
 * @param nbDays the number of days to subtract from today
 * @returns a Date
 */
export function daysAgo (nbDays = 0): Date {
  const date = new Date()
  date.setDate(date.getDate() - nbDays)
  return date
}

/**
 * Return a relative date formatted to ISO 10
 * @param nbDays the number of days to subtract from today
 * @returns a string like : "2019-12-31"
 */
export function daysAgoIso10 (nbDays = 0): string {
  return dateIso10(daysAgo(nbDays))
}
