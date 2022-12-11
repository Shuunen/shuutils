import { after, noIndex } from './constants'
import { clone } from './object-clone'

/**
 * Check if value is in array
 * @param value the value to check
 * @returns true if value is in array
 */
export function isArray (value: unknown): boolean {
  return Array.isArray(value)
}

/**
 * Remove a value from an array
 * @param array the array to remove the value from
 * @param value the value to remove
 * @returns the array without the value
 */
export function removeValueFromArray<T> (array: T[], value: T): T[] {
  if (!array.includes(value)) return array
  const arrayCopy = clone(array)
  arrayCopy.splice(arrayCopy.indexOf(value), 1)
  return arrayCopy
}

/**
 * Add a value to an array if it doesn't already exist
 * @param array the array to add the value to
 * @param item the value to add
 * @param value the value to add
 * @returns the array with the value added (if it didn't already exist)
 */
export function insertValueAfterItem<T> (array: T[], item: T, value: T): T[] {
  const index = array.indexOf(item)
  if (index === noIndex) return array
  const arrayCopy = clone(array)
  const start = Math.min(index + after, arrayCopy.length)
  arrayCopy.splice(start, 0, value)
  return arrayCopy
}
