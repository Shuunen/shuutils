/* istanbul ignore next */
export const emit = (eventName: string, eventData?: unknown): void => {
  if (global.window === undefined) return
  if (eventData === undefined) window.dispatchEvent(new CustomEvent(eventName))
  else window.dispatchEvent(new CustomEvent(eventName, { detail: eventData }))
}

/* istanbul ignore next */
export const on = (eventName: string, callback: (data: string | boolean | number | Record<string, unknown>) => unknown): void => {
  if (global.window === undefined) return
  window.addEventListener(eventName, event => callback(event instanceof CustomEvent ? event.detail : event))
}
