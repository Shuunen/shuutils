import { clone } from './objects'

/**
 * Return an item from an array
 * @param items like : ["great", "place", "pine"]
 * @returns item like : "pine"
 */
export function pickOne<T> (items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T
}

/**
 * Randomize an array using the Fisher-Yates algorithm
 * source : https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
 * @param input the array to shuffle
 * @returns a shuffled clone of the input array
 */
export function shuffleArray<T> (input: T[]): T[] {
  const array = clone(input)
  for (let indexA = array.length - 1; indexA > 0; indexA--) {
    const indexB = Math.floor(Math.random() * (indexA + 1))
    const temporary = array[indexA]
    array[indexA] = array[indexB] as T
    array[indexB] = temporary as T
  }
  return array
}

/**
 * Check if value is in array
 * @param value the value to check
 * @returns true if value is in array
 */
export const isArray = (value: unknown): boolean => Array.isArray(value)

/**
 * Return an array with unique values
 * @param items the array to check/clean/reduce
 * @returns the array with unique values
 */
export const arrayUnique = <T> (items: T[]): T[] => [...new Set(items)]

/**
 * Remove a value from an array
 * @param array the array to remove the value from
 * @param value the value to remove
 * @returns the array without the value
 */
export const removeValueFromArray = <T> (array: T[], value: T): T[] => {
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
export const insertValueAfterItem = <T> (array: T[], item: T, value: T): T[] => {
  const index = array.indexOf(item)
  if (index === -1) return array
  const arrayCopy = clone(array)
  const start = Math.min(index + 1, arrayCopy.length)
  arrayCopy.splice(start, 0, value)
  return arrayCopy
}
