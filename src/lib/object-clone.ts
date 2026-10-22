import { isRecord } from './object-is-record.ts'
import type { Mutable } from './types.ts'

/**
 * Clone a value with structuredClone, or keep it as is when it cannot be cloned
 * @param value the value to clone, like a date, a regex or a typed array
 * @returns the clone, or the value itself
 */
function cloneOrKeep(value: object) {
  try {
    return structuredClone(value)
  } catch {
    return value
  }
}

/**
 * Copy a map or a set, deep copying its keys and values
 * @param value the map or set to copy
 * @param seen the copies already made, to keep shared and circular references
 * @param copyItem the function to deep copy each key and value
 * @returns the copy
 */
function copyCollection(value: ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>, seen: WeakMap<object, unknown>, copyItem: (item: unknown) => unknown) {
  if (value instanceof Map) {
    const map = new Map<unknown, unknown>()
    seen.set(value, map)
    for (const [key, item] of value) map.set(copyItem(key), copyItem(item))
    return map
  }
  const set = new Set<unknown>()
  seen.set(value, set)
  for (const item of value) set.add(copyItem(item))
  return set
}

/**
 * Deep copy a value that structuredClone refuses, like an object holding a function
 * @param value the value to copy
 * @param seen the copies already made, to keep shared and circular references
 * @returns the copy, where functions are the very same references
 */
function deepCopy(value: unknown, seen: WeakMap<object, unknown>): unknown {
  // a function is kept as is, rebuilding it from its source would run code and lose its closure
  if (typeof value !== 'object' || value === null) return value
  if (seen.has(value)) return seen.get(value)
  if (value instanceof Map || value instanceof Set) return copyCollection(value, seen, item => deepCopy(item, seen))
  const cloned = Array.isArray(value) || isRecord(value) ? value : cloneOrKeep(value)
  // a date, a regex, a typed array... is cloned as a whole
  if (cloned !== value) {
    seen.set(value, cloned)
    return cloned
  }
  // an array keeps its trailing holes, a plain object or a class instance holding a function keeps its prototype
  const copy: object = Array.isArray(value) ? [] : (Object.create(Object.getPrototypeOf(value) as object | null) as object)
  if (Array.isArray(copy) && Array.isArray(value)) copy.length = value.length
  seen.set(value, copy)
  // defineProperty keeps an own "__proto__" key, like one from JSON.parse, as a key instead of changing the copy prototype
  for (const [key, item] of Object.entries(value)) Object.defineProperty(copy, key, { configurable: true, enumerable: true, value: deepCopy(item, seen), writable: true })
  return copy
}

/**
 * Return a deep copy of an object or array
 * @param object an object or array to clone
 * @returns the copy, when the object holds a function the copy holds the very same function and the rest is copied
 */
export function clone<Type>(object: Readonly<Type>) {
  try {
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- documents that the copy drops the readonly of the input
    return structuredClone(object) as Mutable<Type>
  } catch {
    return deepCopy(object, new WeakMap()) as Mutable<Type>
  }
}
