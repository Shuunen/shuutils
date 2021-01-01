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
  let dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
  if (removeTimezone && dateString[dateString.length - 1].toLowerCase() === 'z') {
    dateString = dateString.slice(0, Math.max(0, dateString.length - 1))
  }
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

/**
 * Return a relative date formatted to ISO 10
 * @param nbDays the number of days to subtract from today
 */
export const daysAgoIso10 = (nbDays = 0): string => dateIso10(daysAgo(nbDays))
