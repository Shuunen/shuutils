import test from 'ava'
import getTimestamp from '../lib/timestamp'

test('getTimestamp', t => {
  t.true(getTimestamp() > 0)
})
