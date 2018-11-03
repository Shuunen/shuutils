
/**
 * Return a deep copy of an object or array
 * @param item like : { name : "Pine" }
 * @return item copy like : { name : "Pine" }
 */
export function copy<T> (object: T): T {
  return JSON.parse(JSON.stringify(object))
}
