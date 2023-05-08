/**
 * Creates a function that memoizes the result of `callback`
 * @copyright inspired from Angus Croll package `just-memoize` under MIT License Copyright (c) 2016-2023
 * @param callback the function to memoize
 * @returns a memoized function
 */
export function memoize<Callback extends (...args: Parameters<Callback>) => any> (callback: Callback) { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (typeof callback !== 'function') throw new Error('memoize callback parameter should be a function')
  const cache: Record<string, ReturnType<Callback>> = {}
  /**
   * The memoized function
   * @param parameters the arguments to pass to the callback
   * @returns the result of the callback
   */
  function memoized (...parameters: Parameters<Callback>): ReturnType<Callback> {
    const key = JSON.stringify(parameters)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (!(key in cache)) cache[key] = callback(...parameters)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-non-null-assertion
    return cache[key]!
  }
  memoized.cache = cache
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return memoized as unknown as Callback
}
