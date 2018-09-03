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
 * @param {Date} date input date
 * @param {Boolean} removeTimezone remove the last z ?
 */
function dateToIsoString (date, removeTimezone) {
  let dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
  if (removeTimezone && dateStr[dateStr.length - 1].toLowerCase() === 'z') {
    dateStr = dateStr.substr(0, dateStr.length - 1)
  }
  return dateStr
}

module.exports = { dateToIsoString }