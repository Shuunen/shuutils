import { Nb } from './constants'

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
 * @param shouldRemoveTimezone remove the last z ?
 * @returns string like : "2018-09-03T15:24:00.366Z"
 */
export function dateToIsoString (date: Date, shouldRemoveTimezone = false): string {
  let dateString = new Date(date.getTime() - (date.getTimezoneOffset() * Nb.MsInMinute)).toISOString()
  if (shouldRemoveTimezone && dateString.toLowerCase().endsWith('z')) dateString = dateString.slice(0, Math.max(0, dateString.length - 1))
  return dateString
}

/**
 * Format a date to ISO without time
 * @param date input date
 * @returns string like : "2019-12-31"
 */
export function dateIso10 (date = new Date()): string {
  return String(date.toISOString().split('T')[0])
}

/**
 * Format a date to a specific format
 * @param date input date
 * @param format the format to use like : "yyyy-MM-dd" or "dd/MM/yyyy HH:mm:ss"
 * @param locale the locale to use, default is en-US
 * @returns a string like : "2018-09-03"
 */
export function formatDate (date: Date, format: string, locale = 'en-US'): string {
  // eslint-disable-next-line complexity
  return format.replace(/y{4}|yy|M{4}|MM|dd|d|e{4}|e{3}|HH|mm|ss|\s/gu, (match) => {
    switch (match) {
      case 'yyyy':
        return date.toLocaleDateString(locale, { year: 'numeric' })
      case 'yy':
        return date.toLocaleDateString(locale, { year: '2-digit' })
      case 'MMMM':
        return date.toLocaleDateString(locale, { month: 'long' })
      case 'MM':
        return date.toLocaleDateString(locale, { month: '2-digit' })
      case 'dd':
        return date.toLocaleDateString(locale, { day: '2-digit' })
      case 'd':
        return date.toLocaleDateString(locale, { day: 'numeric' })
      case 'eeee':
        return date.toLocaleDateString(locale, { weekday: 'long' })
      case 'eee':
        return date.toLocaleDateString(locale, { weekday: 'short' })
      case 'HH':
        return date.getHours().toString().padStart(match.length, '0')
      case 'mm':
        return date.getMinutes().toString().padStart(match.length, '0')
      case 'ss':
        return date.getSeconds().toString().padStart(match.length, '0')
      default:
        return match
    }
  })
}

/**
 * Make a date readable for us, poor humans
 * @param input a date or a number of milliseconds
 * @param isLong true to return a short version like "3d" instead of "3 days"
 * @returns "1 minute", "4 months" or "1min", "4mon"
 * @example readableTime(3 * Nb.MsInDay) // "3 days"
 * @example readableTime(3 * Nb.MsInDay, true) // "3d"
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function readableTime (input: Date | number, isLong = true): string {
  const ms = typeof input === 'number' ? input : (Date.now() - input.getTime())
  // eslint-disable-next-line func-style, jsdoc/require-jsdoc, sonarjs/no-nested-template-literals
  const format = (value: number, long: string, short: string): string => `${Math.floor(value)}${isLong ? ` ${long + (Math.floor(value) > 1 ? 's' : '')}` : short}`
  if (ms < Nb.MsInSecond) return format(ms, 'millisecond', 'ms')
  if (ms < Nb.MsInMinute) return format(ms / Nb.MsInSecond, 'second', 's')
  if (ms < Nb.MsInHour) return format(ms / Nb.MsInMinute, 'minute', 'min')
  if (ms < Nb.MsInDay) return format(ms / Nb.MsInHour, 'hour', 'h')
  if (ms < Nb.MsInMonth) return format(ms / Nb.MsInDay, 'day', 'd')
  if (ms < Nb.MsInYear) return format(ms / Nb.MsInMonth, 'month', 'mon')
  return format(ms / Nb.MsInYear, 'year', 'y')
}
