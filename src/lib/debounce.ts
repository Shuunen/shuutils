/**
 * Debounce any function, the returned function resolves with the result of the last call
 * @param method the function to debounce
 * @param waitFor the time to wait before calling the function
 * @returns a promise with a resolve type of the original function's return type
 */
export function debounce<Method extends (...parameters: Parameters<Method>) => ReturnType<Method>>(method: Method, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined
  let pending: Pick<PromiseWithResolvers<ReturnType<Method>>, 'reject' | 'resolve'>[] = []
  return (...parameters: Parameters<Method>) => {
    const { promise, reject, resolve } = Promise.withResolvers<ReturnType<Method>>()
    pending.push({ reject, resolve })
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      const callers = pending
      pending = []
      try {
        const result = method(...parameters)
        for (const caller of callers) caller.resolve(result)
      } catch (error) {
        // without this every caller would wait forever
        for (const caller of callers) caller.reject(error)
      }
    }, waitFor)
    return promise
  }
}
