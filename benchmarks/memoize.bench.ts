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

type Parent = { age?: number; firstName: string; lastName: string }

const parent1 = { age: 33, firstName: 'John', lastName: 'Doe' }
const parent2 = { age: 30, firstName: 'Jane', lastName: 'Mac' }
const parent3 = { age: 35, firstName: 'Jack', lastName: 'Doe Li Pra Ne' }
const parent4 = { age: 32, firstName: 'Jill', lastName: 'Mac-Zipper' }
const parent5 = { age: 32, firstName: 'Jules', lastName: 'Macintosh' }
const parent6 = { age: 32, firstName: 'Julien', lastName: 'Ultimate Zozo' }
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
