import { clone } from './objects'

/**
 * Return an item from an array
 * @param Array items like : ["great", "place", "pine"]
 * @return item like : "pine"
 */
export function pickOne<T> (items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * Randomize an array using the Fisher-Yates algorithm
 * source : https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
 * @param array the array to shuffle
 * @returns a shuffled clone of the input array
 */
export function shuffleArray<T> (input: T[]): T[] {
  const array = clone(input)
  for (let indexA = array.length - 1; indexA > 0; indexA--) {
    const indexB = Math.floor(Math.random() * (indexA + 1))
    const temporary = array[indexA]
    array[indexA] = array[indexB]
    array[indexB] = temporary
  }
  return array
}
