/**
 * Sleep let you "pause" or delay processes
 * @param ms the time to wait in milliseconds, default 1000ms / 1 sec
 * @returns promise that resolve in the provided time
 */
export async function sleep (ms = 1000): Promise<number> {
  // eslint-disable-next-line promise/avoid-new, no-promise-executor-return
  return await new Promise(resolve => setTimeout(() => {
    resolve(ms)
  }, ms))
}

/**
 * Determine whether the given object has a property
 * @param object the object to test
 * @param property the property to test
 * @returns true if the object has the property
 */
export function hasOwn (object: object, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, property)
}
