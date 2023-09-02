/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable etc/no-misused-generics */
import { parseJson } from './strings'

function get (key: string, defaultValue: string): string
function get (key: string, defaultValue: boolean): boolean // eslint-disable-line @typescript-eslint/naming-convention
function get (key: string, defaultValue: number): number
function get<T = unknown> (key: string, defaultValue: T): T
function get<T = unknown> (key: string): T | undefined

/**
 * Get a value from the storage media
 * @param key The key of the value to get
 * @param defaultValue The default value to return if the key is not found
 * @returns The value or defaultValue if not found
 */
function get<T = unknown> (key: string, defaultValue?: T) {
  const path = storage.prefix + key
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = storage.media[path] // don't use getItem because it's not supported by all browsers or in memory object storage
  if (data === undefined || data === null || data === '') return defaultValue
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { error, value } = parseJson<T>(data)
  // eslint-disable-next-line no-warning-comments, @typescript-eslint/consistent-type-assertions
  if (error) return data as T // TODO: wait... what ?!
  return value
}

/**
 * Set a value in the storage
 * @param key The key of the value to set
 * @param data The value to set
 * @returns The given value
 */
function set<T> (key: string, data: T) {
  const path = storage.prefix + key
  const value = typeof data === 'string' ? data : JSON.stringify(data)
  Reflect.set(storage.media, path, value)
  return data
}

/**
 * Check if storage has a value
 * @param key The key of the value to check
 * @returns true if storage has a value for the given key
 */
function has (key: string) {
  return get(key) !== undefined
}

/**
 * Remove a value from the storage
 * @param key The key of the value to remove
 */
function clear (key: string) {
  const path = storage.prefix + key
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete storage.media[path]
}

export const storage = {
  clear,
  get,
  has,
  /* c8 ignore next 2 */
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  media: typeof localStorage === 'undefined' ? {} as Storage : localStorage,
  prefix: '', // prefix all keys in the storage with a custom string
  set,
}

export type ShuutilsStorage = typeof storage
