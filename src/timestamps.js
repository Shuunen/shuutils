'use strict'

function getTimestamp (date = new Date()) {
  return Math.round(date.getTime() / 1000)
}

function getTimestampMs (date = new Date()) {
  return date.getTime()
}

module.exports = { getTimestamp, getTimestampMs }