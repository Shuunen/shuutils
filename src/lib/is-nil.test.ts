import { isNil } from './is-nil'

describe('is-nil', () => {
  it('isNil A null is nil', () => {
    expect(isNil(null)).toBe(true)
  })
  it('isNil B undefined is nil', () => {
    expect(isNil(undefined)).toBe(true)
  })
  it('isNil C zero is not nil', () => {
    expect(isNil(0)).toBe(false)
  })
  it('isNil D empty string is not nil', () => {
    expect(isNil('')).toBe(false)
  })
  it('isNil E false is not nil', () => {
    expect(isNil(false)).toBe(false)
  })
})
