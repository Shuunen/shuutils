/* eslint-disable etc/prefer-interface */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable jsdoc/require-jsdoc */
import type { ShuutilsStorage } from './storage'

/**
 * Creates a state object that can be watched for changes, and optionally sync in a storage object
 * @param data The initial state object
 * @param stateStorage The storage object to sync with
 * @param onlyStoreKeys The keys to sync with the storage object, if empty all keys will be synced
 * @returns The state object and a watch function
 */
export function createState<State extends object> (data: State, stateStorage?: ShuutilsStorage, onlyStoreKeys: Array<keyof State> = []): { state: State; watchState: (key: Array<keyof State> | keyof State | '*', callback: () => void) => void } { // eslint-disable-line putout/putout
  type StateListener = () => void
  type StateKey = keyof State
  const useStorage = (key: string | symbol): boolean => stateStorage !== undefined && (onlyStoreKeys.length === 0 || onlyStoreKeys.includes(key as StateKey)) // eslint-disable-line func-style
  const listeners: Partial<Record<StateKey, StateListener[]>> = {}
  const handler: ProxyHandler<State> = {
    set (target: State, key: string | symbol, value: unknown): boolean {
      Reflect.set(target, key, value)
      if (useStorage(key)) stateStorage?.set(key.toString(), value)
      listeners[key as StateKey]?.forEach(callback => { callback() })
      return true
    },
    get (target: State, key: string | symbol): unknown {
      const value = Reflect.get(target, key)
      return useStorage(key) ? stateStorage?.get(key.toString(), value) : value
    },
  }
  const state = new Proxy<State>(data, handler)
  function watchState (key: StateKey | StateKey[] | '*', callback: () => void): void {
    const keys = key === '*' ? (Object.keys(state) as StateKey[]) : Array.isArray(key) ? key : [key] // eslint-disable-line no-nested-ternary
    keys.forEach(stateKey => {
      listeners[stateKey] ||= []
      listeners[stateKey]?.push(callback)
    })
  }
  return { state, watchState }
}
