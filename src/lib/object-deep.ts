/**
 * Get a nested value from an object
 * @see https://github.com/developit/dlv/blob/master/index.js
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/dlv/index.d.ts
 * @param object the object to get the value from
 * @param path the path to the value
 * @param defaultValue the default value to return if the path does not exist
 * @returns the value at the specified path
 */
export function getNested(object: Record<string, unknown> | undefined, path: string | Array<string | number>, defaultValue?: unknown) {
  const pathArray = typeof path === 'string' ? path.split('.') : path
  let result: unknown = object
  for (const key of pathArray) result = result && typeof result === 'object' ? (result as Record<string, unknown>)[key] : undefined

  return result === undefined ? defaultValue : result
}

/**
 * Set a nested value on an object, creating intermediate objects / arrays as needed
 * @see https://github.com/lukeed/dset/blob/master/src/index.js
 * @param object the object to mutate
 * @param path the path of the value to set
 * @param value the value to set
 */
export function setNested(object: Record<string, unknown>, path: string | Array<string | number>, value: unknown) {
  const pathArray = typeof path === 'string' ? path.split('.') : path
  let current: Record<string, unknown> = object
  for (let index = 0; index < pathArray.length; index += 1) {
    const key = String(pathArray[index])
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') return

    if (index === pathArray.length - 1) {
      current[key] = value
      return
    }
    const next = current[key]
    if (typeof next === 'object' && next !== null) {
      current = next as Record<string, unknown>
      continue
    }
    const nextKey = String(pathArray[index + 1]),
      created: Record<string, unknown> = /^\d+$/u.test(nextKey) ? ([] as unknown as Record<string, unknown>) : {}
    current[key] = created
    current = created
  }
}
