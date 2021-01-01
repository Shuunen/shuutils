/* istanbul ignore next */
export const emit = (eventName: string, eventData?: unknown): void => {
  if (global.window === undefined) return
  if (eventData === undefined) window.dispatchEvent(new CustomEvent(eventName))
  else window.dispatchEvent(new CustomEvent(eventName, { detail: eventData }))
}

/* istanbul ignore next */
export const on = (eventName: string, callback: (data: any) => unknown): void => {
  if (global.window === undefined) return
  window.addEventListener(eventName, event => callback((event as CustomEvent).detail))
}
