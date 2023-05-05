/* eslint-disable promise/avoid-new */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-style */

/**
 * Debounce any function
 * @param callback the function to debounce
 * @param waitFor the time to wait before calling the function
 * @returns promise with a resolve type of the original function’s return type
 */
export const debounce = <F extends (...parameters: Parameters<F>) => ReturnType<F>> (callback: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return async (...parameters: Parameters<F>) => await new Promise<ReturnType<F>>(resolve => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      resolve(callback(...parameters))
    }, waitFor)
  })
}
