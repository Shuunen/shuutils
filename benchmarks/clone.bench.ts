/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable jsdoc/require-jsdoc */
import { bench, describe } from 'vitest'
import { Logger, browserContext, clone } from '../src'

const simple = {
  address: {
    city: 'New York',
    street: 'Broadway',
  },
  age: 30,
  email: 'john.doeuf@caramail.fr',
  name: 'John',
}

describe('clone simple object bench', () => {
  bench('structuredClone (native)', () => {
    structuredClone(simple)
  })
  bench('clone (shuutils)', () => {
    clone(simple)
  })
})


function getComplexObject () {
  return {
    address: {
      city: `New York ${Math.random().toString()}`,
      geo: {
        lat: 40.7128 + Math.random() / 1000,
        lng: -74.006 + Math.random() / 1000,
      },
      postalCode: 10_001 + Math.floor(Math.random() * 1000),
      // randNum: () => Math.random(), // can't be structuredClone
      street: `Broadway ${Math.random().toString()}`,
    },
    age: 30 + Math.floor(Math.random() * 10),
    birthday: new Date(1990, 1, 1 + Math.floor(Math.random() * 10)),
    context: browserContext(),
    email: `john.doe${Math.random().toString().slice(1, 5)}@caramail.fr`,
    logger: new Logger(),
    name: `John ${Math.random().toString().slice(1, 5)}`,
  }
}

const complex = Array.from({ length: 100 }).fill(getComplexObject())

describe('clone complex object bench', () => {
  bench('structuredClone (native)', () => {
    structuredClone(complex)
  })
  bench('clone (shuutils)', () => {
    clone(complex)
  })
})
