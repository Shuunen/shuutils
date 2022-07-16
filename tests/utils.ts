
import { test } from 'uvu'
import { equal } from 'uvu/assert'

export const check = <T> (title: string, actual: T, expected: T) => {
  return test(title, () => {
    return equal(actual, expected)
  })
}
