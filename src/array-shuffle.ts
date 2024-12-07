import { nbPrevious } from './constants'
import { clone } from './object-clone'

/**
 * Randomize an array using the Fisher-Yates algorithm
 * source : https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
 * @param input the array to shuffle
 * @returns a shuffled clone of the input array
 */
export function shuffleArray<Type>(input: readonly Type[]) {
  const array = clone(input)
  for (let indexA = array.length - 1; indexA > 0; indexA += nbPrevious) {
    const indexB = Math.floor(Math.random() * (indexA + 1))
    const temporary = array[indexA]
    array[indexA] = array[indexB] as Type // eslint-disable-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
    array[indexB] = temporary as Type // eslint-disable-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
  }
  return array
}
