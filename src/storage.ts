import { jsonParse } from './objects'

/**
 * Get a value from the storage
 * @param key The key of the value to get
 * @param storage The storage to use like localStorage, sessionStorage or a custom object
 * @returns The value or undefined if not found
 */
async function get<T = unknown> (key: string, storage = localStorage): Promise<T | undefined> {
  if (storage[key] === undefined) return
  const data = String(storage[key])
  const { error, value } = jsonParse(data)
  if (error) return data as unknown as T
  return value as T
}

/**
 * Set a value in the storage
 * @param key The key of the value to set
 * @param data The value to set
 * @param storage The storage to use like localStorage, sessionStorage or a custom object
 * @returns The given value
 */
async function set (key: string, data: string | Record<string, unknown> | unknown[], storage = localStorage): Promise<string | Record<string, unknown> | unknown[]> {
  storage[key] = typeof data === 'object' ? JSON.stringify(data) : data
  return data
}

/**
 * Check if storage has a value
 * @param key The key of the value to check
 * @param storage The storage to use like localStorage, sessionStorage or a custom object
 * @returns true if storage has a value for the given key
 */
async function has (key: string, storage = localStorage): Promise<boolean> {
  const value = await get(key, storage)
  return value !== undefined
}

/**
 * Remove a value from the storage
 * @param key The key of the value to remove
 * @param storage The storage to use like localStorage, sessionStorage or a custom object
 */
function clear (key: string, storage = localStorage): void {
  /* eslint-disable-next-line @typescript-eslint/no-dynamic-delete */
  delete storage[key]
}

export const storage = { get, set, has, clear }
