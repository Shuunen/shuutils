/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

type ListenerMedia = Element | HTMLElement | typeof globalThis | Window

export interface Listener {
  callback: (event: unknown) => unknown
  media: ListenerMedia
  name: string
}

/**
 * Emit an event on a media, window by default
 * @param name the name of the event
 * @param data the data to emit
 * @param media the media to emit the event from, like window or a dom element
 */
export function emit<Data>(name: string, data?: Readonly<Data>, media: ListenerMedia = globalThis) {
  if (data === undefined) media.dispatchEvent(new CustomEvent(name))
  else media.dispatchEvent(new CustomEvent(name, { detail: data }))
}

/**
 * Listen to an event on a media, window by default
 * @param name the name of the event to listen to
 * @param callback the callback to call when the event is emitted
 * @param media the media to listen to the event, like window or a dom element
 * @returns false if the event cannot be not listened to or a listener object if it can
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function on<Data>(name: string, callback: (data: Data, event: Event) => unknown, media: ListenerMedia = globalThis) {
  /**
   * The callback to call when the event is emitted
   * @param event the event
   * @returns the result of the callback
   */
  function onCallback(event: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
    return callback(event instanceof CustomEvent ? event.detail : event, event as Event)
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  media.addEventListener(name, onCallback, { passive: true })
  return { callback: onCallback, media, name }
}

/**
 * Remove a listener from a media, window by default
 * @param listener the listener to remove
 * @param listener.media the media to remove the listener from, like window or a dom element
 * @param listener.name the name of the event to remove the listener from
 * @param listener.callback the callback to remove
 */
export function off({ callback, media, name }: Readonly<Listener>) {
  media.removeEventListener(name, callback)
}
