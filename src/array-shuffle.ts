import { Nb } from './constants'
import { clone } from './object-clone'

/**
 * Randomize an array using the Fisher-Yates algorithm
 * source : https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
 * @param input the array to shuffle
 * @returns a shuffled clone of the input array
 */
export function shuffleArray<T> (input: T[]) {
  const array = clone(input)
  // eslint-disable-next-line for-direction
  for (let indexA = array.length - 1; indexA > 0; indexA += Number(Nb.Previous)) {
    const indexB = Math.floor(Math.random() * (indexA + 1))
    const temporary = array[indexA]
    array[indexA] = array[indexB] as T // eslint-disable-line @typescript-eslint/consistent-type-assertions
    array[indexB] = temporary as T // eslint-disable-line @typescript-eslint/consistent-type-assertions
  }
  return array
}
