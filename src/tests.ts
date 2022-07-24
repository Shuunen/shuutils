
import { test } from 'uvu'
import { equal } from 'uvu/assert'

/**
 * Check if the actual value is equal to the expected value
 * @param title the title of the test
 * @param actual the actual value
 * @param expected the expected value
 * @returns nothing
 */
export const check = <T> (title: string, actual: T | Promise<T>, expected?: T | Promise<T>): void => {
  if (actual instanceof Promise) return test(title, async () => {
    if (expected instanceof Promise) return equal(await actual, await expected)
    return equal(await actual, expected)
  })
  return test(title, () => equal(actual, expected))
}

// give the uvu runner to check shortcut
check.run = test.run
