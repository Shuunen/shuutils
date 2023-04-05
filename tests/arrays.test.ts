import { expect, it } from 'vitest'
import { arrayUnique, insertValueAfterItem, isArray, pickOne, removeValueFromArray, shuffleArray } from '../src'

const elements = ['damn', 'this', 'test', 'is', 'crazy']
const elementsShuffled = shuffleArray(elements)
it('shuffle an array does not affect the original one', () => { expect(elementsShuffled).not.toStrictEqual(elements) })

const elementPicked = pickOne(elements)
it('pick one returns an element from the array', () => { expect(elementPicked && elements.includes(elementPicked)).toStrictEqual(true) })

it('isArray on null', () => { expect(isArray(null)).toStrictEqual(false) }) // eslint-disable-line unicorn/no-null
it('isArray on an array', () => { expect(isArray([1, 2])).toStrictEqual(true) })
it('isArray on an empty array', () => { expect(isArray([])).toStrictEqual(true) })
it('isArray on an empty string', () => { expect(isArray('')).toStrictEqual(false) })
it('isArray on a number', () => { expect(isArray(-1)).toStrictEqual(false) })
it('isArray on an empty record', () => { expect(isArray({})).toStrictEqual(false) })
it('isArray on a record', () => { expect(isArray({ name: 'John' })).toStrictEqual(false) })

it('array unique A', () => { expect(arrayUnique([1, 1, 2, 1, 1, 3, 1])).toStrictEqual([1, 2, 3]) })
it('array unique B', () => { expect(arrayUnique(['plop', 'plop', 2, 'plop', 'plop', 3, 'plop'])).toStrictEqual(['plop', 2, 3]) })
it('array unique C', () => { expect(arrayUnique([{ name: 'John' }, 'plop', { name: 'John' }, 3, 'plop'])).toStrictEqual([{ name: 'John' }, 'plop', { name: 'John' }, 3]) })

it('remove value from array case A', () => { expect(removeValueFromArray([1, 2, 3, 4], 2)).toStrictEqual([1, 3, 4]) })
it('remove value from array case B', () => { expect(removeValueFromArray([1, 2, 2, 3], 2)).toStrictEqual([1, 2, 3]) })
it('remove value from array case C', () => { expect(removeValueFromArray([1, 3], 2)).toStrictEqual([1, 3]) })
it('remove value from array case D', () => { expect(removeValueFromArray([], 2)).toStrictEqual([]) })

it('insert value after item case A', () => { expect(insertValueAfterItem([1, 2, 3, 5], 3, 4)).toStrictEqual([1, 2, 3, 4, 5]) })
it('insert value after item case B', () => { expect(insertValueAfterItem([1, 'deux', 3], 3, 4)).toStrictEqual([1, 'deux', 3, 4]) })
it('insert value after item case C', () => { expect(insertValueAfterItem([1, 'deux', 3], 1, 1.5)).toStrictEqual([1, 1.5, 'deux', 3]) })
it('insert value after item case D', () => { expect(insertValueAfterItem([1, 2, 3], 4, 4)).toStrictEqual([1, 2, 3]) })
it('insert value after item case E', () => { expect(insertValueAfterItem([], 4, 4)).toStrictEqual([]) })

