'use strict'

/**
 * Give timestamp of a date or now in seconds
 * @param date input date
 */
export function getTimestamp (date: Date = new Date()): number {
  return Math.round(date.getTime() / 1000)
}

/**
 * Give timestamp of a date or now in milliseconds
 * @param date input date
 */
export function getTimestampMs (date: Date = new Date()): number {
  return date.getTime()
}
