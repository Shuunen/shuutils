import test from 'ava'
import { access, clone, copy } from '../src'

const person = { name: 'John', age: 21, details: { favoriteFood: 'sushi' } }
const persons = ['John', 'Fanny']

test('copy object', t => {
  const personCopy = copy(person)
  personCopy.age = 42
  t.is(person.age, 21)
  t.is(personCopy.age, 42)
})

test('copy-less object', t => {
  const personCopy = person
  personCopy.age = 42
  t.is(person.age, 42)
  t.is(personCopy.age, 42)
})

test('copy array', t => {
  const personsCopy = copy(persons)
  personsCopy[1] = 'Bob'
  t.is(persons[1], 'Fanny')
  t.is(personsCopy[1], 'Bob')
})

test('copy-less array', t => {
  const personsCopy = persons
  personsCopy[1] = 'Bob'
  t.is(persons[1], 'Bob')
  t.is(personsCopy[1], 'Bob')
})

test('clone is a better name', t => t.deepEqual(copy(person), clone(person)))

test('nested existing property access', t => t.is(access(person, 'details.favoriteFood'), 'sushi'))
test('nested non-existing property access', t => t.is(access(person, 'details.favoriteDrink'), undefined))
test('nested non-existing property access with a default value', t => t.is(access(person, 'details.favoriteDrink', 'wine'), 'wine'))
