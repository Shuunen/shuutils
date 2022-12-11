/**
 * Debounce any function
 * @param callback the function to debounce
 * @param waitFor the time to wait before calling the function
 * @returns promise with a resolve type of the original function’s return type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...parameters: any[]) => ReturnType<F>> (callback: F, waitFor: number): (...parameters: Parameters<F>) => Promise<ReturnType<F>> {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let timeout: ReturnType<typeof setTimeout>
  // eslint-disable-next-line promise/avoid-new
  return async (...parameters: Parameters<F>) => await new Promise(resolve => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      resolve(callback(...parameters))
    }, waitFor)
  })
}

/**
 * Throttle a function, inspired from https://www.matthewgerstman.com/tech/throttle-and-debounce/
 * @param callback the function to throttle
 * @param timeout the time to wait before each function call
 * @returns a throttled function
 */
export function throttle<F extends (...parameters: any[]) => ReturnType<F>> (callback: F, timeout: number): (...parameters: Parameters<F>) => void { // eslint-disable-line @typescript-eslint/no-explicit-any
  let isReady = true
  return (...parameters: Parameters<F>) => {
    if (!isReady) return
    isReady = false
    callback(...parameters)
    setTimeout(() => {
      isReady = true
    }, timeout)
  }
}

/**
 * Sleep let you "pause" or delay processes
 * @param ms the time to wait in milliseconds, default 1000ms / 1 sec
 * @returns promise that resolve in the provided time
 */
export async function sleep (ms = 1000): Promise<number> {
  // eslint-disable-next-line promise/avoid-new, no-promise-executor-return
  return await new Promise(resolve => setTimeout(() => { resolve(ms) }, ms))
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
