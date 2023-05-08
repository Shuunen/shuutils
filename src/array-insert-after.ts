import { nbAfter, nbNoIndex } from './constants'
import { clone } from './object-clone'

/**
 * Add a value to an array if it doesn't already exist
 * @param array the array to add the value to
 * @param item the value to add
 * @param value the value to add
 * @returns the array with the value added (if it didn't already exist)
 */
export function insertValueAfterItem<T> (array: T[], item: T, value: T) {
  const index = array.indexOf(item)
  if (index === nbNoIndex) return array
  const arrayCopy = clone(array)
  const start = Math.min(index + nbAfter, arrayCopy.length)
  arrayCopy.splice(start, 0, value)
  return arrayCopy
}
