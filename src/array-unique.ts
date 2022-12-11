/**
 * Return an array with unique values
 * @param items the array to check/clean/reduce
 * @returns the array with unique values
 */
export function arrayUnique<T> (items: T[]): T[] {
  return Array.from(new Set(items))
}