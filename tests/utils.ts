
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { test } from 'uvu'

export const check = <T> (title: string, actual: T, expected: T) => {
  return test(title, () => {
    if (typeof actual === 'object') return deepEqual(actual, expected)
    return equal(actual, expected)
  })
}
