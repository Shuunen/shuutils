'use strict'

export function getTimestamp(date: Date = new Date()): number {
  return Math.round(date.getTime() / 1000)
}

export function getTimestampMs(date: Date = new Date()): number {
  return date.getTime()
}