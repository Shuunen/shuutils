
import { test } from 'uvu'
import { equal } from 'uvu/assert'

/**
 * Check if the actual value is equal to the expected value
 * @param title the title of the test
 * @param actual the actual value
 * @param expected the expected value
 * @returns nothing
 */
export const check = <T> (title: string, actual: T, expected: T): void => {
  return test(title, () => {
    return equal(actual, expected)
  })
}

// give the uvu runner to check shortcut
check.run = test.run
