import test from 'ava'
import getTimestamp from '../src/timestamp'

test('timestamp give positive number', t => {
  t.true(getTimestamp() > 0)
})

test('timestamp give date before year 3003', t => {
  t.true(getTimestamp() < 32603558400000)
})
