import { invariant } from './invariant'

describe('invariant', () => {
  it('invariant A does not throw on a truthy condition', () => {
    expect(() => {
      invariant(true, 'should not throw')
    }).not.toThrow()
  })

  it('invariant B throws on a falsy condition', () => {
    expect(() => {
      invariant(false, 'boom')
    }).toThrowErrorMatchingInlineSnapshot(`[Error: boom]`)
  })

  it('invariant C throws on undefined', () => {
    expect(() => {
      invariant(undefined, 'undefined is falsy')
    }).toThrow('undefined is falsy')
  })

  it('invariant D narrows the type', () => {
    const value: string | undefined = 'hello'
    invariant(value, 'value is missing')
    expect(value.length).toBe(5)
  })
})
