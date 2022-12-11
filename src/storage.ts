import { first, second, two } from './constants'
import { parseJson } from './strings'

/* c8 ignore next 2 */
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const defaultMedia = typeof localStorage === 'undefined' ? {} as Storage : localStorage

function get (key: string, defaultValue: undefined, media?: Storage): unknown
function get<T> (key: string, media?: Storage): T | undefined // eslint-disable-line etc/no-misused-generics
function get (key: string, defaultValue: string, media?: Storage): string
function get (key: string, defaultValue: boolean, media?: Storage): boolean // eslint-disable-line @typescript-eslint/naming-convention
function get (key: string, defaultValue: number, media?: Storage): number
function get<T> (key: string, defaultValue: T, media?: Storage): T
function get<T> (key: string, defaultValue: undefined, media?: Storage): T | undefined // eslint-disable-line etc/no-misused-generics

/**
 * Get a value from the storage media
 * @param key The key of the value to get
 * @param {...any} args Either a defaultValue and a storage media, or just a storage media
 * @returns The value or defaultValue if not found
 */
// eslint-disable-next-line putout/putout
function get<T> (key: string, ...args: (Storage | T | undefined)[]): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const defaultValue = (args.length === two ? args[first] : undefined) as T

  /* c8 ignore next 2 */
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unnecessary-condition
  const media = (args.length === two ? args[second] : args[first]) as Storage ?? (typeof window === 'undefined' ? {} : localStorage) as Storage
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const path = storage.prefix + key
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = media[path] // don't use getItem because it's not supported by all browsers or in memory object storage
  if (data === undefined || data === null) return defaultValue
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
 * @param media The storage media to use like localStorage, sessionStorage or a custom object
 * @returns The given value
 */
function set<T> (key: string, data: T, media = defaultMedia): T {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const path = storage.prefix + key
  // eslint-disable-next-line no-param-reassign
  media[path] = typeof data === 'string' ? data : JSON.stringify(data) // don't use setItem because it's not supported by all browsers or in memory object storage
  return data
}

/**
 * Check if storage has a value
 * @param key The key of the value to check
 * @param media The storage media to use like localStorage, sessionStorage or a custom object
 * @returns true if storage has a value for the given key
 */
function has (key: string, media = defaultMedia): boolean {
  const value = get(key, undefined, media)
  return value !== undefined
}

/**
 * Remove a value from the storage
 * @param key The key of the value to remove
 * @param media The storage media to use like localStorage, sessionStorage or a custom object
 */
function clear (key: string, media = defaultMedia): void {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const path = storage.prefix + key
  // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-dynamic-delete
  delete media[path]
}

export const storage = {
  defaultMedia,
  prefix: '', // prefix all keys in the storage with a custom string
  get,
  set,
  has,
  clear,
}
