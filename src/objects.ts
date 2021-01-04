import { delve } from './imports'

/**
 * Return a deep copy of an object or array
 * @param item like : { name : "Pine" }
 * @return item copy like : { name : "Pine" }
 */
export function copy<T>(object: T): T {
  return JSON.parse(JSON.stringify(object))
}

/**
 * Return a deep copy of an object or array
 * @param item like : { name : "Pine" }
 * @return item clone like : { name : "Pine" }
 */
export const clone = copy

/**
 * Access nested property with the help of delve https://github.com/developit/dlv
 * @param object the base object to search into
 * @param path the full path to access nested property
 * @param default optional, return this value if nested prop not found
 * @return the nested property value
 */
export const access = delve
