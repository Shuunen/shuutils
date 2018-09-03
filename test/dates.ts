import test from 'ava'
import { dateToIsoString } from '../dist'

test('iso string date has length', t => {
  t.true(dateToIsoString(new Date()).length > 0)
})

test('iso string date contains timezone by default', t => {
  t.true(dateToIsoString(new Date()).toLowerCase().indexOf('z') !== -1)
})

test('iso string date does not contains timezone if needed', t => {
  t.true(dateToIsoString(new Date(), true).toLowerCase().indexOf('z') === -1)
})
