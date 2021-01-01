import { ok } from 'assert'
import { dateToIsoString } from '../src'

it('iso string date has length', () => {
  ok(dateToIsoString(new Date()).length > 0)
})

it('iso string date contains timezone by default', () => {
  ok(dateToIsoString(new Date()).toLowerCase().includes('z'))
})

it('iso string date does not contains timezone if needed', () => {
  ok(!dateToIsoString(new Date(), true).toLowerCase().includes('z'))
})
