
import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'

// eslint-disable-next-line mocha/no-exports
export const test = (title: string, actual: unknown, expected?: unknown): Mocha.Test => {
  return it(title, function () {
    if (typeof actual === 'object') return deepEqual(actual, expected)
    return equal(actual, expected)
  })
}
