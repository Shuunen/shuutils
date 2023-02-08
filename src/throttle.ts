/**
 * Throttle a function, inspired from https://www.matthewgerstman.com/tech/throttle-and-debounce/
 * @param callback the function to throttle
 * @param timeout the time to wait before each function call
 * @returns a throttled function
 */
export function throttle<F extends (...parameters: any[]) => ReturnType<F>> (callback: F, timeout: number) { // eslint-disable-line @typescript-eslint/no-explicit-any
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
