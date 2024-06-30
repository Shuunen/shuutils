import { expect, it } from 'vitest'
import { hasOwn, sleep } from '../src'

it('hasOwn A', () => {
  expect(hasOwn({ propA: 1 }, 'propA')).toBe(true)
})
it('hasOwn B', () => {
  expect(hasOwn({ propA: 1 }, 'propB')).toBe(false)
})
it('hasOwn C', () => {
  expect(hasOwn({ propA: 1 }, 'toString')).toBe(false)
})
it('hasOwn D', () => {
  expect(hasOwn({ propA: 1 }, 'hasOwnProperty')).toBe(false)
})

it('sleep A', async () => {
  expect(await sleep(10)).toBe(10)
})
it('sleep B', async () => {
  expect(await sleep(20)).toBe(20)
})
