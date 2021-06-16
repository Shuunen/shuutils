import { deepStrictEqual as deepEqual, strictEqual as equal } from 'assert'
import { access, clone, copy } from '../src'

describe('objects', function () {
  const person = { name: 'John', age: 21, details: { favoriteFood: 'sushi' } }
  const persons = ['John', 'Fanny']

  it('copy object', function () {
    const personCopy = copy(person)
    personCopy.age = 42
    equal(person.age, 21)
    equal(personCopy.age, 42)
  })

  it('copy-less object', function () {
    const personCopy = person
    personCopy.age = 42
    equal(person.age, 42)
    equal(personCopy.age, 42)
  })

  it('copy array', function () {
    const personsCopy = copy(persons)
    personsCopy[1] = 'Bob'
    equal(persons[1], 'Fanny')
    equal(personsCopy[1], 'Bob')
  })

  it('copy-less array', function () {
    const personsCopy = persons
    personsCopy[1] = 'Bob'
    equal(persons[1], 'Bob')
    equal(personsCopy[1], 'Bob')
  })

  it('clone is a better name', function () { return deepEqual(copy(person), clone(person)) })

  it('nested existing property access', function () { return equal(access(person, 'details.favoriteFood'), 'sushi') })
  it('nested non-existing property access', function () { return equal(access(person, 'details.favoriteDrink'), undefined) })
  it('nested non-existing property access with a default value', function () { return equal(access(person, 'details.favoriteDrink', 'wine'), 'wine') })
})
