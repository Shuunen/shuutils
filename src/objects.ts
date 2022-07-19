import { arrayUnique } from './arrays'

export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
  T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> :
  T[P]
}

/**
 * Return a deep copy of an object or array
 * @param object like : `{ name : "Pine" }`
 * @returns item copy like : `{ name : "Pine" }`
 */
export function copy<T> (object: T): T {
  return JSON.parse(JSON.stringify(object))
}

/**
 * Return a deep copy of an object or array
 * @param item like : `{ name : "Pine" }`
 * @returns item clone like : `{ name : "Pine" }`
 */
export const clone = copy

/**
 * Access nested property
 * @param object the base object to search into
 * @param path the full path to access nested property
 * @returns the nested property value
 */
export const access = (object: Record<string, unknown>, path: string): unknown => flatten(object)[path]

/**
 * Convert a multi-level deep object into a single-level, flatten, object
 * @param object like `{ person: { name: 'John Doe', age: 32 } }`
 * @param path optional, add a root path to all keys
 * @param separator optional, the character to join keys
 * @returns object like `{ 'person.name': 'John Doe', 'person.age': 32 }`
 */
export function flatten (object: Record<string, unknown>, path = '', separator = '.'): Record<string, unknown> {
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.keys(object).reduce((accumulator, key: string) => {
    const value = object[key]
    const newPath = Array.isArray(object) ? `${path}[${key}]` : [path, key].filter(Boolean).join(separator)
    const isObject = [typeof value === 'object', value !== null, !(value instanceof Date), !(value instanceof RegExp), !(Array.isArray(value) && value.length === 0)].every(Boolean)
    return isObject ? { ...accumulator, ...flatten(value as Record<string, unknown>, newPath, separator) } : { ...accumulator, [newPath]: value }
  }, {})
}

/**
 * Sort an array of objects by a specific property of theses objects, example :
 * ```js
 * persons.sort(byProperty('name'))
 * ```
 * @param property the property to sort by
 * @param order the order to sort, default is ascending
 * @returns the sorted array
 */
export function byProperty<T extends Record<string, unknown>> (property: string, order: 'asc' | 'desc' | '' = ''): (a: T, b: T) => number {
  if (order === '') return () => 0
  const sortOrder = order === 'asc' ? 1 : -1
  return (a: T, b: T) => {
    const valueA = a[property] as number
    const valueB = b[property] as number
    if (!valueA && valueB) return 1 * sortOrder
    if (valueA && !valueB) return -1 * sortOrder
    const result = (valueA < valueB) ? -1 : ((valueA > valueB) ? 1 : 0)
    return result * sortOrder
  }
}

/**
 * Check if a value is an object/record
 * @param value the value to check
 * @returns true if value is an object/record
 */
export const isRecord = (value: unknown): boolean => (
  value !== null &&
  (typeof value === 'object' || typeof value === 'function') &&
  !Array.isArray(value)
)

/**
 * Like Object.assign but only non-null/undefined values can overwrite
 * @param target Destination object
 * @param sources Object(s) to sequentially merge
 * @returns The resulting object merged
 */
export const safeAssign = (target: Record<string, unknown>, ...sources: Record<string, unknown>[]): Record<string, unknown> => {
  if (sources.length === 0) return target
  const source = sources.shift()
  if (isRecord(target) && isRecord(source)) for (const key in source) if (isRecord(source[key])) {
    if (!target[key]) Object.assign(target, { [key]: {} })
    safeAssign(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
  } else if (source[key] !== null && source[key] !== undefined) Object.assign(target, { [key]: source[key] })
  return safeAssign(target, ...sources)
}

/**
 * Automagically generate styling classes from an object
 * @param object every key-value will generate a class, ex: { enabled: true, disabled: false, size: 'large' }
 * @param keys optional, filter the keys to use
 * @param cls optional, additional classes to add, ex: "add-me"
 * @returns ready to use string class list, ex: "enabled size-large add-me"
 */
export const genClass = (object: unknown, keys: string[] = [], cls: string[] = []): string => {
  if (typeof object !== 'object' || !object) return ''
  if (Array.isArray(object)) cls.push(...object.join(' ').split(' '))
  else keys = keys.length > 0 ? keys : Object.keys(object)
  for (const key of keys) {
    const boolean = (object as Record<string, boolean>)[key]
    const string = (object as Record<string, string>)[key]
    const array = (object as Record<string, unknown[]>)[key]
    if (boolean === true) cls.push(key)
    else if (typeof string === 'string' && string.length > 0) cls.push(`${key}-${String(string)}`)
    else if (Array.isArray(array) && array.length > 0) cls.push(`has-${key}`)
  }
  return arrayUnique(cls).join(' ').trim().replace(/\s+/g, ' ')
}
