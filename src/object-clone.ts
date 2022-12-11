/**
 * Return a deep copy of an object or array
 * @param object like : `{ name : "Pine" }`
 * @returns item copy like : `{ name : "Pine" }`
 */
export function clone<T> (object: T): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return JSON.parse(JSON.stringify(object)) as T
}
