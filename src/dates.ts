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

/**
 * Return a relative date formatted to ISO 10
 * @param nbDays the number of days to subtract from today
 */
export const daysAgoIso10 = (nbDays = 0): string => dateIso10(daysAgo(nbDays))

/**
 * Make a date readable for us, poor humans
 * Kudos to https://coolaj86.com/articles/time-ago-in-under-50-lines-of-javascript/
 * @param input a date or a number of milliseconds
 * @returns "a minute ago", "4 days ago"
 */
export const readableTimeAgo = (input: Date | number): string => {
  const MOMENTS = 2
  const MINUTE = 60
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR
  const WEEK = 7 * DAY
  const MONTH = 30 * DAY
  const YEAR = 365 * DAY
  const ms = typeof input === 'number' ? input : (Date.now() - input.getTime())
  let ago = Math.floor(ms / 1000)
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

export const formatDate = (date: Date, format: string, locale = 'en-US'): string => {
  return format.replace(/yyyy|yy|MMMM|MM|dd|d|eeee|eee|HH|mm|ss|\s/g, (match) => {
    switch (match) {
    case 'yyyy':
      return date.toLocaleDateString(locale, { year: 'numeric' })
    case 'yy':
      return date.toLocaleDateString(locale, { year: '2-digit' })
    case 'MMMM': // does not work on Node... no idea why
      return date.toLocaleDateString(locale, { month: 'long' })
    case 'MM':
      return date.toLocaleDateString(locale, { month: '2-digit' })
    case 'dd':
      return date.toLocaleDateString(locale, { day: '2-digit' })
    case 'd':
      return date.toLocaleDateString(locale, { day: 'numeric' })
    case 'eeee': // does not work on Node... no idea why
      return date.toLocaleDateString(locale, { weekday: 'long' })
    case 'eee':
      return date.toLocaleDateString(locale, { weekday: 'short' })
    case 'HH':
      return date.getHours().toString().padStart(2, '0')
    case 'mm':
      return date.getMinutes().toString().padStart(2, '0')
    case 'ss':
      return date.getSeconds().toString().padStart(2, '0')
    default:
      return match
    }
  })
}
