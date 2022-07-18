/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Listener {
  callback: (event: any) => any
  media: any
  name: string
}

/**
 * Emit an event on a media, window by default
 * @param name the name of the event
 * @param data the data to emit
 * @param media the media to emit the event from, like window or a dom element
 */
export const emit = (name: string, data?: unknown, media: HTMLElement | Element | Window = window): void => {
  if (data === undefined) media.dispatchEvent(new CustomEvent(name))
  else media.dispatchEvent(new CustomEvent(name, { detail: data }))
}

/**
 * Listen to an event on a media, window by default
 * @param name the name of the event to listen to
 * @param callback the callback to call when the event is emitted
 * @param media the media to listen to the event, like window or a dom element
 * @returns a listener object
 */
export const on = (name: string, callback: (data: any, event: Event) => unknown, media: HTMLElement | Element | Window = window): Listener => {
  /**
   * The callback to call when the event is emitted
   * @param event the event
   * @returns the result of the callback
   */
  const onCallback = (event: any): unknown => callback(event instanceof CustomEvent ? event.detail : event, event)
  media.addEventListener(name, onCallback)
  return { name, callback: onCallback, media }
}

/**
 * Remove a listener from a media, window by default
 * @param root0 the listener to remove
 * @param root0.media the media to remove the listener from, like window or a dom element
 * @param root0.name the name of the event to remove the listener from
 * @param root0.callback the callback to remove
 */
export const off = ({ media, name, callback }: Listener): void => {
  media.removeEventListener(name, callback)
}
