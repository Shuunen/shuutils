import { Nb } from './constants'
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
  if (ms < Nb.MsInMinute) return rtf.format(-Math.floor(ms / Nb.MsInSecond), 'second')
  if (ms < Nb.MsInHour) return rtf.format(-Math.floor(ms / Nb.MsInMinute), 'minute')
  if (ms < Nb.MsInDay) return rtf.format(-Math.floor(ms / Nb.MsInHour), 'hour')
  if (ms < Nb.MsInWeek) return rtf.format(-Math.floor(ms / Nb.MsInDay), 'day')
  if (ms < Nb.MsInMonth) return rtf.format(-Math.floor(ms / Nb.MsInWeek), 'week')
  if (ms < Nb.MsInYear) return rtf.format(-Math.floor(ms / Nb.MsInMonth), 'month')
  return rtf.format(-Math.floor(ms / Nb.MsInYear), 'year')
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
