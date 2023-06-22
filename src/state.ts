
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
export function createState<State extends object> (data: State, stateStorage?: ShuutilsStorage, onlyStoreKeys: Array<keyof State> = []) { // eslint-disable-line putout/putout
  type StateKey = keyof State
  const useStorage = (key: string | symbol) => stateStorage !== undefined && (onlyStoreKeys.length === 0 || onlyStoreKeys.includes(key as StateKey)) // eslint-disable-line func-style
  const listeners: Partial<Record<StateKey, StateCallback[]>> = {}
  const handler: ProxyHandler<State> = {
    set (target: State, key: string | symbol, value: unknown) {
      Reflect.set(target, key, value)
      if (useStorage(key)) stateStorage?.set(key.toString(), value)
      listeners[key as StateKey]?.forEach(callback => {
        callback(key.toString(), value)
      })
      return true
    },
    // eslint-disable-next-line sonar/function-return-type
    get (target: State, key: string | symbol) {
      const value = Reflect.get(target, key)
      return useStorage(key) ? stateStorage?.get(key.toString(), value) : value
    },
  }
  const state = new Proxy<State>(data, handler)
  function watchState (key: StateKey | StateKey[] | '*', callback: StateCallback) {
    const keys = key === '*' ? (Object.keys(state) as StateKey[]) : Array.isArray(key) ? key : [key] // eslint-disable-line no-nested-ternary
    keys.forEach(stateKey => {
      listeners[stateKey] ||= []
      listeners[stateKey]?.push(callback)
    })
  }
  return { state, watchState }
}
