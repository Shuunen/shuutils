import { ok } from 'assert'
import { getTimestamp, getTimestampMs } from '../src'

it('timestamp of a specific date', () => ok(getTimestamp(new Date('1989-05-14')) === 611107200))

it('timestamp give positive number', () => ok(getTimestamp() > 0))

it('timestamp give date before year 3003', () => ok(getTimestamp() < 32603558400000))

it('timestamp ms of a specific date', () => ok(getTimestampMs(new Date('1989-05-14')) === 611107200000))

it('timestamp ms is a 1000 times bigger', () => {
  const sizeMs = getTimestampMs().toString().length
  const sizeS = getTimestamp().toString().length
  ok((sizeMs - sizeS) === 3)
})
