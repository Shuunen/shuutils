import { pickOne } from './array-pick-one.ts'

const elements = ['damn', 'this', 'test', 'is', 'crazy']
const elementPicked = pickOne(elements)

describe('array-pick-one', () => {
  it('pick one returns an element from the array', () => {
    expect(elements).toContain(elementPicked)
  })

  it('pick one returns undefined', () => {
    expect(() => pickOne([false].filter(Boolean))).toThrowErrorMatchingInlineSnapshot('[Error: Array is empty]')
  })
})
