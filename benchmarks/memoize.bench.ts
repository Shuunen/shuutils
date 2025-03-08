import { describe } from 'bun:test'
import { memoize, objectSum } from '../src/shuutils'

// Maybe try to bench other memoize functions from https://gist.github.com/thetallweeks/a55cc2fedfd65d16b9ea

// fake bench function, initially I was using Vitest bench but now i'm using Bun, there is no bench function in Bun for now

/**
 * Fake bench function, initially I was using Vitest bench but now i'm using Bun, there is no bench function in Bun for now
 * @param name the name of the bench
 * @param functionA the function to bench
 */
function bench(name: string, functionA: () => void) {
  describe(name, functionA)
}

/**
 * A simple sort function
 * @param numberA the first number
 * @param numberB the second number
 * @returns {number} the difference between the two numbers
 */
function simpleSortFunction(numberA: number, numberB: number) {
  return numberA - numberB
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const numbers = [1, 5, 4, 2, 2, 3, 1, 2, 3]

const memoizedSimpleSortFunction = memoize(simpleSortFunction)

describe('simple sort', () => {
  bench('native', () => {
    Array.from(numbers).sort(simpleSortFunction)
  })

  bench('memoized', () => {
    Array.from(numbers).sort(memoizedSimpleSortFunction)
  })
})

type Parent = { age?: number; firstName: string; lastName: string }

const parent1 = { age: 33, firstName: 'John', lastName: 'Doe' }
const parent2 = { age: 30, firstName: 'Jane', lastName: 'Mac' }
const parent3 = { age: 35, firstName: 'Jack', lastName: 'Doe Li Pra Ne' }
const parent4 = { age: 32, firstName: 'Jill', lastName: 'Mac-Zipper' }
const parent5 = { age: 32, firstName: 'Jules', lastName: 'Macintosh' }
const parent6 = { age: 32, firstName: 'Julien', lastName: 'Ultimate Zozo' }
const parents: Parent[] = [parent1, parent2, parent3, parent4, parent5, parent6]

/**
 * A complex sort function
 * @param parentA the first parent
 * @param parentB the second parent
 * @returns {number} the difference between the two parents
 */
function complexSortFunction(parentA: Readonly<Parent>, parentB: Readonly<Parent>) {
  return objectSum(parentA) - objectSum(parentB)
}

const memoizedComplexSortFunction = memoize(complexSortFunction)

describe('complex sort', () => {
  bench('native', () => {
    Array.from(parents).sort(complexSortFunction)
  })

  bench('memoized', () => {
    Array.from(parents).sort(memoizedComplexSortFunction)
  })
})
