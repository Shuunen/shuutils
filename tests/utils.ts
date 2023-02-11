import { expect, it } from 'vitest'

/**
 * Check if the actual value is equal to the expected value
 * @param title the title of the test
 * @param actual the actual value
 * @param expected the expected value
 */
export function check<T> (title: string, actual: Promise<T> | T, expected?: Promise<T> | T) {
  it(title, async () => {
    const resolvedActual = (actual instanceof Promise) ? await actual : actual
    const resolvedExpected = (expected instanceof Promise) ? await expected : expected
    expect(resolvedActual).toStrictEqual(resolvedExpected)
  })
}

/**
 * Check if the actual value is equal to the expected snapshot
 * @param title the title of the test
 * @param actual the actual value
 */
export function checkSnapshot<T> (title: string, actual: Promise<T> | T) {
  it(title, async () => {
    const resolvedActual = (actual instanceof Promise) ? await actual : actual
    expect(resolvedActual).toMatchSnapshot()
  })
}
