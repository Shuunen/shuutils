
/**
 * Debounce any function
 * @param func the fonction to debounce
 * @param waitFor time before executing function
 * @returns promise with a resolve type of the original function's return type
 */
export function debounce<F extends (...arguments_: any[]) => any>(function_: F, waitFor: number) {
  let timeout = setTimeout(/* istanbul ignore next */() => { }, waitFor)
  return (...arguments_: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      clearTimeout(timeout)
      timeout = setTimeout(() => resolve(function_(...arguments_)), waitFor)
    })
}

/**
 * Sleep let you "pause" or delay processes
 * @param ms the time to wait in milliseconds, default 1000ms / 1 sec
 * @returns promise that resolve in the provided time
 */
export function sleep (ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
