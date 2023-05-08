import { bench, describe } from 'vitest'
import { memoize, objectSum } from '../src'

// Maybe try to bench other memoize functions from https://gist.github.com/thetallweeks/a55cc2fedfd65d16b9ea

function simpleSortFunction (numberA: number, numberB: number) {
  return numberA - numberB
}

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

type Parent = { firstName: string; lastName: string; age?: number }

const parent1 = { firstName: 'John', lastName: 'Doe', age: 33 }
const parent2 = { firstName: 'Jane', lastName: 'Mac', age: 30 }
const parent3 = { firstName: 'Jack', lastName: 'Doe Li Pra Ne', age: 35 }
const parent4 = { firstName: 'Jill', lastName: 'Mac-Zipper', age: 32 }
const parent5 = { firstName: 'Jules', lastName: 'Macintosh', age: 32 }
const parent6 = { firstName: 'Julien', lastName: 'Ultimate Zozo', age: 32 }
const parents: Parent[] = [parent1, parent2, parent3, parent4, parent5, parent6]

function complexSortFunction (parentA: Parent, parentB: Parent) {
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
