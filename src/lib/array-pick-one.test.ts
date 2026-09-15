import { pickOne } from './array-pick-one'

const elements = ['damn', 'this', 'test', 'is', 'crazy'],
  elementPicked = pickOne(elements)

test('pick one returns an element from the array', () => {
  expect(elements).toContain(elementPicked)
})

test('pick one returns undefined', () => {
  expect(() => pickOne([false].filter(Boolean))).toThrowErrorMatchingInlineSnapshot('[Error: Array is empty]')
})
