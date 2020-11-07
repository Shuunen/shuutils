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
export function dateToIsoString (date: Date, removeTimezone?: boolean): string {
  let dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
  if (removeTimezone && dateString[dateString.length - 1].toLowerCase() === 'z') {
    dateString = dateString.slice(0, Math.max(0, dateString.length - 1))
  }
  return dateString
}
