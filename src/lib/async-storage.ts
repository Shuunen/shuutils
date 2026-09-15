import { storage } from './storage'

export type AsyncStorage = {
  get: <Type>(key: string) => Promise<Type | undefined>
  set: <Type>(key: string, value: Type) => Promise<Type>
  /** Delete one value from the storage */
  delete: (key: string) => Promise<void>
}

export const localStorageDriver = {
  delete: (key: string) => Promise.resolve(localStorage.removeItem(key)),
  get: <Type>(key: string) => Promise.resolve(storage.get<Type>(key)),
  set: <Type>(key: string, value: Type) => Promise.resolve(storage.set(key, value)),
} satisfies AsyncStorage

/**
 * Create an in-memory async storage driver, handy for tests and non-persistent usage
 * @returns an async storage driver backed by a plain object
 */
export function createInMemoryDriver() {
  const memory: Record<string, unknown> = {}
  return {
    // oxlint-disable-next-line typescript/no-dynamic-delete
    delete: (key: string) => Promise.resolve(void delete memory[key]), // NOSONAR
    get: <Type>(key: string) => Promise.resolve(memory[key] as Type | undefined),
    set: <Type>(key: string, value: Type) => Promise.resolve((memory[key] = value)), // NOSONAR
  } satisfies AsyncStorage
}

/**
 * Create a namespaced async storage on top of the given driver
 * @param name the namespace prefixing every key
 * @param driver the underlying async storage driver
 * @returns an async storage scoped to the given namespace
 */
export function createAsyncStorage(name: string, driver: AsyncStorage) {
  return {
    delete: (key: string) => driver.delete(`${name}_${key}`),
    get: <Type>(key: string) => driver.get<Type>(`${name}_${key}`),
    set: <Type>(key: string, value: Type) => driver.set<Type>(`${name}_${key}`, value),
  } satisfies AsyncStorage
}
