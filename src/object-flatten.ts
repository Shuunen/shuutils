
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
    const updatedPath = Array.isArray(object) ? `${path}[${key}]` : [path, key].filter(Boolean).join(separator)
    const isObject = [typeof value === 'object', value !== null, !(value instanceof Date), !(value instanceof RegExp), !(Array.isArray(value) && value.length === 0)].every(Boolean)
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return isObject ? { ...accumulator, ...flatten(value as Record<string, unknown>, updatedPath, separator) } : { ...accumulator, [updatedPath]: value }
  }, {})
}
