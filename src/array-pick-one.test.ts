import { expect, it } from 'bun:test'
import { pickOne } from './array-pick-one'

const elements = ['damn', 'this', 'test', 'is', 'crazy']

const elementPicked = pickOne(elements)

it('pick one returns an element from the array', () => {
  expect(elements.includes(elementPicked)).toStrictEqual(true)
})

it('pick one returns undefined', () => {
  expect(() => pickOne([false].filter(Boolean))).toThrowErrorMatchingInlineSnapshot(`"Array is empty"`)
})
