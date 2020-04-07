import test from 'ava'
import { copy } from '../dist'

test('copy object', t => {
  const person = {
    name: 'John',
    age: 21,
  }
  const personCopy = copy(person)
  personCopy.age = 42
  t.is(person.age, 21)
  t.is(personCopy.age, 42)
})

test('no copy object', t => {
  const person = {
    name: 'John',
    age: 21,
  }
  const personCopy = person
  personCopy.age = 42
  t.is(person.age, 42)
  t.is(personCopy.age, 42)
})

test('copy array', t => {
  const persons = ['John', 'Fanny']
  const personsCopy = copy(persons)
  personsCopy[1] = 'Bob'
  t.is(persons[1], 'Fanny')
  t.is(personsCopy[1], 'Bob')
})

test('no copy array', t => {
  const persons = ['John', 'Fanny']
  const personsCopy = persons
  personsCopy[1] = 'Bob'
  t.is(persons[1], 'Bob')
  t.is(personsCopy[1], 'Bob')
})
