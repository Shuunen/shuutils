import { isObjectEmpty } from './object-is-empty.ts'

describe('object-is-empty', () => {
  it('isObjectEmpty A on empty object', () => {
    expect(isObjectEmpty({})).toBe(true)
  })

  it('isObjectEmpty B on non-empty object', () => {
    expect(isObjectEmpty({ name: 'John' })).toBe(false)
  })
})
