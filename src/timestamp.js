'use strict'

function getTimestamp (date = new Date()) {
  return Math.round(date.getTime() / 1000)
}

module.exports = getTimestamp