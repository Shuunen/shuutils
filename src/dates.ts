'use strict'

/**
 * Convert a date into iso string
 *
 * Example with timezone
 * in  : dateToIsoString(new Date())
 * out : "2018-09-03T15:24:00.366Z"
 *
 * Example without timezone
 * in  : dateToIsoString(new Date(), true)
 * out : "2018-09-03T15:24:00.366"
 *
 * @param date input date
 * @param removeTimezone remove the last z ?
 * @returns string like : "2018-09-03T15:24:00.366Z"
 */
export function dateToIsoString (date: Date, removeTimezone = false): string {
  let dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60_000)).toISOString()
  if (removeTimezone && dateString[dateString.length - 1].toLowerCase() === 'z')
    dateString = dateString.slice(0, Math.max(0, dateString.length - 1))

  return dateString
}

/**
 * Return a relative Date
 * @param nbDays the number of days to subtract from today
 */
export const daysAgo = (nbDays = 0): Date => (d => new Date(d.setDate(d.getDate() - nbDays)))(new Date())

/**
 * Format a date to ISO without time
 * @param date
 * @returns string like : "2019-12-31"
 */
export const dateIso10 = (date = new Date()): string => date.toISOString().split('T')[0]

/* istanbul ignore next */
/**
 * Return a relative date formatted to ISO 10
 * @param nbDays the number of days to subtract from today
 */
export const daysAgoIso10 = (nbDays = 0): string => dateIso10(daysAgo(nbDays))

const MOMENTS = 2
export const MINUTE = 60
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR
export const WEEK = 7 * DAY
export const MONTH = 30 * DAY
export const YEAR = 365 * DAY

/**
 * Make a date readable for us, poor humans
 * Kudos to https://coolaj86.com/articles/time-ago-in-under-50-lines-of-javascript/
 * @param date
 * @returns "a minute ago", "4 days ago"
 */
export const readableTimeAgo = (date: Date): string => {
  let ago = Math.floor(date.getTime() / 1000)
  let part = 0
  if (ago < MOMENTS) return 'a moment ago'
  if (ago < MINUTE) return ago + ' seconds ago'
  if (ago < (2 * MINUTE)) return 'a minute ago'
  if (ago < HOUR) {
    while (ago >= MINUTE) { ago -= MINUTE; part += 1 }
    return part + ' minutes ago'
  }
  if (ago < (2 * HOUR)) return 'an hour ago'
  if (ago < DAY) {
    while (ago >= HOUR) { ago -= HOUR; part += 1 }
    return part + ' hours ago'
  }
  if (ago < (2 * DAY)) return 'a day ago'
  if (ago < WEEK) {
    while (ago >= DAY) { ago -= DAY; part += 1 }
    return part + ' days ago'
  }
  if (ago < (2 * WEEK)) return 'a week ago'
  if (ago < MONTH) {
    while (ago >= WEEK) { ago -= WEEK; part += 1 }
    return part + ' weeks ago'
  }
  if (ago < (2 * MONTH)) return 'a month ago'
  if (ago < YEAR) {
    while (ago >= MONTH) { ago -= MONTH; part += 1 }
    return part + ' months ago'
  }
  return 'more than a year ago'
}
