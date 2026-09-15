/**
 * Debounce any function, the returned function resolves with the result of the last call
 * @param callback the function to debounce
 * @param waitFor the time to wait before calling the function
 * @returns a promise with a resolve type of the original function's return type
 */
export function debounce<Method extends (...parameters: Parameters<Method>) => ReturnType<Method>>(callback: Method, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let pending: ((value: ReturnType<Method>) => void)[] = []
  return async (...parameters: Parameters<Method>) =>
    new Promise<ReturnType<Method>>(resolve => {
      pending.push(resolve)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        const result = callback(...parameters)
        const resolvers = pending
        pending = []
        for (const done of resolvers) done(result)
      }, waitFor)
    })
}
