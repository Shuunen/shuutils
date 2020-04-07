import test from 'ava'
import { getTimestamp, getTimestampMs } from '../dist'

test('timestamp of a specific date', t => t.true(getTimestamp(new Date('1989-05-14')) === 611107200))

test('timestamp give positive number', t => t.true(getTimestamp() > 0))

test('timestamp give date before year 3003', t => t.true(getTimestamp() < 32603558400000))

test('timestamp ms of a specific date', t => t.true(getTimestampMs(new Date('1989-05-14')) === 611107200000))

test('timestamp ms is a 1000 times bigger', t => {
  const sizeMs = getTimestampMs().toString().length
  const sizeS = getTimestamp().toString().length
  t.true((sizeMs - sizeS) === 3)
})
