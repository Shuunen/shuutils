
/**
 * Return a deep copy of an object or array
 * @param item like : `{ name : "Pine" }`
 * @return item copy like : `{ name : "Pine" }`
 */
export function copy<T> (object: T): T {
  return JSON.parse(JSON.stringify(object))
}

/**
 * Return a deep copy of an object or array
 * @param item like : `{ name : "Pine" }`
 * @return item clone like : `{ name : "Pine" }`
 */
export const clone = copy

/**
 * Access nested property
 * Credits : https://github.com/developit/dlv
 * @param object the base object to search into
 * @param path the full path to access nested property
 * @param default optional, return this value if nested prop not found
 * @return the nested property value
 */
export const access = (object: Record<string, any>, key: string, defaultValue?: any): any => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const keys = key.split('.')
  for (const element of keys) object = object[element] // simplified from initial "object = object ? object[element] : undefined" ... ¯\_(ツ)_/¯
  return object === undefined ? defaultValue : object
}

/**
 * Convert a multi-level deep object into a single-level, flatten, object
 * @param object like `{ person: { name: 'John Doe', age: 32 } }`
 * @param path, optional, add a root path to all keys
 * @returns object like `{ 'person.name': 'John Doe', 'person.age': 32 }`
 */
export function flatten<T extends Record<string, unknown>> (object: T, path = ''): any { // eslint-disable-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.keys(object).reduce<T>((accumulator: T, key: string): T => {
    const value = object[key]
    const newPath = Array.isArray(object) ? `${path}[${key}]` : [path, key].filter(Boolean).join('.')
    const isObject = [
      typeof value === 'object',
      value !== null,
      !(value instanceof Date),
      !(value instanceof RegExp),
      !(Array.isArray(value) && value.length === 0),
    ].every(Boolean)
    return isObject ? { ...accumulator, ...flatten(value as Record<string, unknown>, newPath) } : { ...accumulator, [newPath]: value }
  }, {} as T)
}

/**
 * Sort an array of objects by a specific property of theses objects, example :
 * ```js
 * persons.sort(byProperty('name'))
 * ```
 */
export function byProperty (property: string, order: 'asc' | 'desc' | '' = ''): (a: Record<string, unknown>, b: Record<string, unknown>) => number {
  if (order === '') return () => 0
  const sortOrder = order === 'asc' ? 1 : -1
  return (a: Record<string, unknown>, b: Record<string, unknown>) => {
    if (!a[property] && b[property]) return 1 * sortOrder
    if (a[property] && !b[property]) return -1 * sortOrder
    const result = ((a[property] as number) < (b[property] as number)) ? -1 : (((a[property] as number) > (b[property] as number)) ? 1 : 0)
    return result * sortOrder
  }
}

/**
 * Automagically generate styling classes from an object
 * @param object every key-value will generate a class, ex: { enabled: true, disabled: false, size: 'large' }
 * @param keys optional, filter the keys to use
 * @param cls optional, additional classes to add, ex: "add-me"
 * @returns ready to use string class list, ex: "enabled size-large add-me"
 */
export const genClass = (object: Record<string, unknown>, keys: string[] = [], cls: string[] = []): string => {
  if (typeof object !== 'object' || !object) return ''
  keys = keys.length > 0 ? keys : Object.keys(object)
  for (const key of keys) {
    const bool = (object as Record<string, boolean>)[key]
    const str = (object as Record<string, string>)[key]
    const array = (object as Record<string, any[]>)[key] // eslint-disable-line @typescript-eslint/no-explicit-any
    if (bool === true) cls.push(key)
    else if (typeof str === 'string' && str.length > 0) cls.push(`${key}-${String(str)}`)
    else if (Array.isArray(array) && array.length > 0) cls.push(`has-${key}`)
  }
  return cls.join(' ').trim().replace(/\s+/g, ' ')
}
