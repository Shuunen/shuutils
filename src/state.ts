
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable jsdoc/require-jsdoc */
import type { ShuutilsStorage } from './storage'

type StateCallback = (() => void) | ((updatedKey: string, updatedValue?: unknown) => void)

/**
 * Creates a state object that can be watched for changes, and optionally sync in a storage object
 * @param data The initial state object
 * @param stateStorage The storage object to sync with
 * @param onlyStoreKeys The keys to sync with the storage object, if empty all keys will be synced
 * @returns The state object and a watch function
 */
export function createState<State extends object> (data: State, stateStorage?: ShuutilsStorage, onlyStoreKeys: Array<keyof State> = []) { // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
  type StateKey = keyof State
  const useStorage = (key: string | symbol) => stateStorage !== undefined && (onlyStoreKeys.length === 0 || onlyStoreKeys.includes(key as StateKey))
  const listeners: Partial<Record<StateKey, StateCallback[]>> = {}
  const handler: ProxyHandler<State> = {
    get (target: State, key: string | symbol) {
      const localValue: State[StateKey] = Reflect.get(target, key) // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (useStorage(key)) return stateStorage!.get(key.toString(), localValue)
      return localValue
    },
    set (target: State, key: string | symbol, value: unknown) {
      Reflect.set(target, key, value)
      if (useStorage(key)) stateStorage?.set(key.toString(), value)
      listeners[key as StateKey]?.forEach(callback => { callback(key.toString(), value) })// eslint-disable-line unicorn/no-array-for-each
      return true
    },
  }
  const state = new Proxy<State>(data, handler)
  function watchState (key: '*' | StateKey | StateKey[], callback: StateCallback) { // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
    const keys = key === '*' ? (Object.keys(state) as StateKey[]) : (Array.isArray(key) ? key : [key])
    for (const stateKey of keys)
      if (listeners[stateKey] === undefined) listeners[stateKey] = [callback] // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
      else listeners[stateKey]!.push(callback)
  }
  return { state, watchState }
}
