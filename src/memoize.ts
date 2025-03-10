/**
 * Creates a function that memoizes the result of `callback`
 * @copyright inspired from Angus Croll package `just-memoize` under MIT License Copyright (c) 2016-2023
 * @param callback the function to memoize
 * @returns a memoized function
 */
export function memoize<Callback extends (...arguments_: Parameters<Callback>) => unknown>(callback: Callback) {
  // eslint-disable-next-line no-restricted-syntax
  if (typeof callback !== 'function') throw new Error('memoize callback parameter should be a function')
  const cache: Record<string, ReturnType<Callback>> = {}
  /**
   * The memoized function
   * @param parameters the arguments to pass to the callback
   * @returns the result of the callback
   */
  function memoized(...parameters: Parameters<Callback>) {
    const key = JSON.stringify(parameters)
    // @ts-expect-error cache[key] is unknown
    if (!(key in cache)) cache[key] = callback(...parameters)
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return cache[key]! // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }
  memoized.cache = cache
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
  return memoized as unknown as Callback
}
