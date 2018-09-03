import test from 'ava'
import { dateToIsoString } from '../src/dates'

test('iso string date has length', t => {
  t.true(dateToIsoString(new Date()).length > 0)
})

test('iso string date contains timezone by default', t => {
  t.true(dateToIsoString(new Date()).toLowerCase().includes('z'))
})

test('iso string date does not contains timezone if needed', t => {
  t.false(dateToIsoString(new Date(), true).toLowerCase().includes('z'))
})
