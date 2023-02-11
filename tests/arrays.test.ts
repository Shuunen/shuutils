import { arrayUnique, insertValueAfterItem, isArray, pickOne, removeValueFromArray, shuffleArray } from '../src'
import { check } from './utils'

const elements = ['damn', 'this', 'test', 'is', 'crazy']
const elementsShuffled = shuffleArray(elements)
check('shuffle an array does not affect the original one', (elementsShuffled[0] !== 'damn') || (elementsShuffled[1] !== 'this') || (elementsShuffled[2] !== 'test'), true)

const elementPicked = pickOne(elements)
check('pick one returns an element from the array', elementPicked && elements.includes(elementPicked), true)

check('isArray on null', isArray(null), false) // eslint-disable-line unicorn/no-null
check('isArray on an array', isArray([1, 2]), true)
check('isArray on an empty array', isArray([]), true)
check('isArray on an empty string', isArray(''), false)
check('isArray on a number', isArray(-1), false)
check('isArray on an empty record', isArray({}), false)
check('isArray on a record', isArray({ name: 'John' }), false)

check('array unique A', arrayUnique([1, 1, 2, 1, 1, 3, 1]), [1, 2, 3])
check('array unique B', arrayUnique(['plop', 'plop', 2, 'plop', 'plop', 3, 'plop']), ['plop', 2, 3])
check('array unique C', arrayUnique([{ name: 'John' }, 'plop', { name: 'John' }, 3, 'plop']), [{ name: 'John' }, 'plop', { name: 'John' }, 3])

check('remove value from array case A', removeValueFromArray([1, 2, 3, 4], 2), [1, 3, 4])
check('remove value from array case B', removeValueFromArray([1, 2, 2, 3], 2), [1, 2, 3])
check('remove value from array case C', removeValueFromArray([1, 3], 2), [1, 3])
check('remove value from array case D', removeValueFromArray([], 2), [])

check('insert value after item case A', insertValueAfterItem([1, 2, 3, 5], 3, 4), [1, 2, 3, 4, 5])
check('insert value after item case B', insertValueAfterItem([1, 'deux', 3], 3, 4), [1, 'deux', 3, 4])
check('insert value after item case C', insertValueAfterItem([1, 'deux', 3], 1, 1.5), [1, 1.5, 'deux', 3])
check('insert value after item case D', insertValueAfterItem([1, 2, 3], 4, 4), [1, 2, 3])
check('insert value after item case E', insertValueAfterItem([], 4, 4), [])

