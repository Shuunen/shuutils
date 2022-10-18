import { parseJson } from './strings'

function get<T> (key: string, media?: Storage): T | undefined
function get (key: string, defaultValue: string, media?: Storage): string
function get (key: string, defaultValue: boolean, media?: Storage): boolean
function get (key: string, defaultValue: number, media?: Storage): number
function get<T> (key: string, defaultValue: T, media?: Storage): T
function get<T> (key: string, defaultValue: undefined, media?: Storage): T | undefined
/**
 * Get a value from the storage media
 * @param key The key of the value to get
 * @param {...any} args Either a defaultValue and a storage media, or just a storage media
 * @returns The value or defaultValue if not found
 */
function get<T> (key: string, ...args: Array<T | undefined | Storage>): T | undefined {
  const defaultValue = (args?.length === 2 ? args[0] : undefined) as T | undefined
  /* c8 ignore next */
  const media = (args?.length === 2 ? args[1] : args[0]) as Storage ?? (typeof window === 'undefined' ? {} : localStorage) as Storage
  const path = storage['prefix'] + key
  const data = media[path] // don't use getItem because it's not supported by all browsers or in memory object storage
  if (data === undefined || data === null) return defaultValue
  const { error, value } = parseJson<T>(data)
  if (error) return data as T // TODO: wait... what ?!
  return value
}

/**
 * Set a value in the storage
 * @param key The key of the value to set
 * @param data The value to set
 * @param media The storage media to use like localStorage, sessionStorage or a custom object
 * @returns The given value
 */
function set<T> (key: string, data: T, media = localStorage): T {
  const value = typeof data === 'string' ? data : JSON.stringify(data)
  const path = storage['prefix'] + key
  media[path] = value // don't use setItem because it's not supported by all browsers or in memory object storage
  return data
}

/**
 * Check if storage has a value
 * @param key The key of the value to check
 * @param media The storage media to use like localStorage, sessionStorage or a custom object
 * @returns true if storage has a value for the given key
 */
function has (key: string, media = localStorage): boolean {
  const value = get(key, undefined, media)
  return value !== undefined
}

/**
 * Remove a value from the storage
 * @param key The key of the value to remove
 * @param media The storage media to use like localStorage, sessionStorage or a custom object
 */
function clear (key: string, media = localStorage): void {
  const path = storage['prefix'] + key
  delete media[path]
}

export const storage = {
  prefix: '', // prefix all keys in the storage with a custom string
  get,
  set,
  has,
  clear,
}
