import { isObjectEmpty } from './object-is-empty'

test('isObjectEmpty A on empty object', () => {
  expect(isObjectEmpty({})).toBe(true)
})

test('isObjectEmpty B on non-empty object', () => {
  expect(isObjectEmpty({ name: 'John' })).toBe(false)
})
