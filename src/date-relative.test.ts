import { expect, it } from 'vitest'
import { daysFromNow } from './date-relative'
import { dateIso10 } from './dates'

it('daysFromNow A without param', () => {
  expect(daysFromNow().toISOString()).toContain(dateIso10())
})
