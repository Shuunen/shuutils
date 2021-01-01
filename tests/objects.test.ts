import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { access, clone, copy } from '../src'

describe('objects', () => {
  const person = { name: 'John', age: 21, details: { favoriteFood: 'sushi' } }
  const persons = ['John', 'Fanny']

  it('copy object', () => {
    const personCopy = copy(person)
    personCopy.age = 42
    equal(person.age, 21)
    equal(personCopy.age, 42)
  })

  it('copy-less object', () => {
    const personCopy = person
    personCopy.age = 42
    equal(person.age, 42)
    equal(personCopy.age, 42)
  })

  it('copy array', () => {
    const personsCopy = copy(persons)
    personsCopy[1] = 'Bob'
    equal(persons[1], 'Fanny')
    equal(personsCopy[1], 'Bob')
  })

  it('copy-less array', () => {
    const personsCopy = persons
    personsCopy[1] = 'Bob'
    equal(persons[1], 'Bob')
    equal(personsCopy[1], 'Bob')
  })

  it('clone is a better name', () => deepEqual(copy(person), clone(person)))

  it('nested existing property access', () => equal(access(person, 'details.favoriteFood'), 'sushi'))
  it('nested non-existing property access', () => equal(access(person, 'details.favoriteDrink'), undefined))
  it('nested non-existing property access with a default value', () => equal(access(person, 'details.favoriteDrink', 'wine'), 'wine'))
})
