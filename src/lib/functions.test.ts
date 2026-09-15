import { functionReturningUndefined, functionReturningVoid, hasOwn } from './functions'

test('hasOwn A', () => {
  expect(hasOwn({ propA: 1 }, 'propA')).toBe(true)
})

test('hasOwn B', () => {
  expect(hasOwn({ propA: 1 }, 'propB')).toBe(false)
})

test('hasOwn C', () => {
  expect(hasOwn({ propA: 1 }, 'toString')).toBe(false)
})

test('hasOwn D', () => {
  expect(hasOwn({ propA: 1 }, 'hasOwnProperty')).toBe(false)
})

test('functionReturningVoid A', () => {
  expect(functionReturningVoid()).toMatchInlineSnapshot(`undefined`)
})

test('functionReturningUndefined A', () => {
  expect(functionReturningUndefined()).toMatchInlineSnapshot(`undefined`)
})
