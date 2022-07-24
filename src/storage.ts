import { parseJson } from './strings'

export const storage = {
  /**
   * Prefix all keys in the storage with a custom string
   */
  prefix: '',
  /**
   * Get a value from the storage
   * @param key The key of the value to get
   * @param storage The storage to use like localStorage, sessionStorage or a custom object
   * @returns The value or undefined if not found
   */
  get: async function get<T> (key: string, storage = localStorage): Promise<T | undefined> {
    const path = this.prefix + key
    const data = storage[path] // don't use getItem because it's not supported by all browsers or in memory object storage
    if (data === undefined || data === null) return
    const { error, value } = parseJson<T>(data)
    if (error) return data as T
    return value
  },
  /**
   * Set a value in the storage
   * @param key The key of the value to set
   * @param data The value to set
   * @param storage The storage to use like localStorage, sessionStorage or a custom object
   * @returns The given value
   */
  set: async function set<T> (key: string, data: T, storage = localStorage): Promise<T> {
    const value = typeof data === 'string' ? data : JSON.stringify(data)
    const path = this.prefix + key
    storage[path] = value // don't use setItem because it's not supported by all browsers or in memory object storage
    return data
  },
  /**
   * Check if storage has a value
   * @param key The key of the value to check
   * @param storage The storage to use like localStorage, sessionStorage or a custom object
   * @returns true if storage has a value for the given key
   */
  has: async function has (key: string, storage = localStorage): Promise<boolean> {
    const value = await this.get(key, storage)
    return value !== undefined
  },
  /**
   * Remove a value from the storage
   * @param key The key of the value to remove
   * @param storage The storage to use like localStorage, sessionStorage or a custom object
   */
  clear: function clear (key: string, storage = localStorage): void {
    const path = this.prefix + key
    delete storage[path]
  },
}
