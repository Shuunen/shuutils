import { expect, it } from 'vitest'
import { functionReturningUndefined, functionReturningVoid, hasOwn, sleep } from './shuutils'

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

it('functionReturningVoid A', () => {
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  expect(functionReturningVoid()).toMatchInlineSnapshot(`undefined`)
})

it('functionReturningUndefined A', () => {
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  expect(functionReturningUndefined()).toMatchInlineSnapshot(`undefined`)
})
