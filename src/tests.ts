/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable putout/putout */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Check if the actual value is equal to the expected value
 * @param title the title of the test
 * @param actual the actual value
 * @param expected the expected value
 * @returns nothing
 */
export function check<T> (title: string, actual: Promise<T> | T, expected?: Promise<T> | T) {
  const { test } = require('uvu')
  const { equal } = require('uvu/assert')
  if (actual instanceof Promise) return test(title, async () => {
    if (expected instanceof Promise) return equal(await actual, await expected)
    return equal(await actual, expected)
  })
  return test(title, () => equal(actual, expected))
}

/**
 * Run all the tests declared in the file
 */
export function checksRun () {
  require('uvu').test.run()
}
