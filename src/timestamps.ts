import { Nb } from './constants'

/**
 * Give timestamp of a date or now in seconds
 * @param date input date
 * @returns number like : 1541258097
 */
export function getTimestamp (date: Date = new Date()) {
  return Math.round(date.getTime() / Nb.MsInSecond)
}

/**
 * Give timestamp of a date or now in milliseconds
 * @param date input date
 * @returns number like : 1541258116567
 */
export function getTimestampMs (date: Date = new Date()) {
  return date.getTime()
}
