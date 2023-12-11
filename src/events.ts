/* c8 ignore start */
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
 * @returns true if the event is emitted
 */
export function emit<Data> (name: string, data?: Readonly<Data>, media?: Element | HTMLElement | Window) {
  let targetMedia = media
  if (targetMedia === undefined) {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line no-console
      console.error('no media provided & no window available')
      return false
    }
    targetMedia = window
  }
  if (data === undefined) targetMedia.dispatchEvent(new CustomEvent(name))
  else targetMedia.dispatchEvent(new CustomEvent(name, { detail: data }))
  return true
}

/**
 * Listen to an event on a media, window by default
 * @param name the name of the event to listen to
 * @param callback the callback to call when the event is emitted
 * @param media the media to listen to the event, like window or a dom element
 * @returns false if the event cannot be not listened to or a listener object if it can
 */
export function on<Data> (name: string, callback: (data: Data, event: Event) => unknown, media?: Element | HTMLElement | Window) {
  let targetMedia = media
  if (targetMedia === undefined) {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line no-console
      console.error('no media provided & no window available')
      return false
    }
    targetMedia = window
  }

  /**
   * The callback to call when the event is emitted
   * @param event the event
   * @returns the result of the callback
   */
  function onCallback (event: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/consistent-type-assertions
    return callback(event instanceof CustomEvent ? event.detail : event, event as Event)
  }
  targetMedia.addEventListener(name, onCallback)
  return { callback: onCallback, media, name }
}

/**
 * Remove a listener from a media, window by default
 * @param root0 the listener to remove
 * @param root0.media the media to remove the listener from, like window or a dom element
 * @param root0.name the name of the event to remove the listener from
 * @param root0.callback the callback to remove
 */
export function off ({ callback, media, name }: Readonly<Listener>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  media.removeEventListener(name, callback)
}

/* c8 ignore stop */
