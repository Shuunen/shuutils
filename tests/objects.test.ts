import { strictEqual as equal } from 'assert'
import { access, byProperty, clone, copy, flatten, genClass } from '../src'
import { test } from './utils'

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

  test('clone is a better name', copy(person), clone(person))

  test('nested existing property access', access(person, 'details.favoriteFood'), 'sushi')
  test('nested non-existing property access', access(person, 'details.favoriteDrink'))
  test('nested non-existing property access with a default value', access(person, 'details.favoriteDrink', 'wine'), 'wine')
  test('access a non-nested property', access({ name: 'John Cena' }, 'name'), 'John Cena')
  test('access a non-existing non-nested property', access({ name: 'John Cena' }, 'age'))
  test('access a non-nested property after an undefined property', access({ age: undefined, name: 'John Cena' }, 'name'), 'John Cena')

  test('flatten an object', flatten(person), { 'age': 21, 'details.favoriteFood': 'sushi', 'name': 'John' })
  test('flatten an object with a custom root path', flatten(person, 'person'), { 'person.age': 21, 'person.details.favoriteFood': 'sushi', 'person.name': 'John' })
  test('flatten an object containing an array', flatten({ name: 'John', collection: ['pikachu', 'drake'] }), { 'name': 'John', 'collection[0]': 'pikachu', 'collection[1]': 'drake' })

  const users = [{ name: 'John', age: 21, pic: 'wow.png' }, { name: 'Albert', age: 42 }, { name: 'Sam', age: 22 }, { name: 'Birgit', age: 11 }]
  test('sort objects by property without order does not sort', users.sort(byProperty('name'))[0].name, 'John')
  test('sort objects by property with asc order does sort', users.sort(byProperty('name', 'asc'))[0].name, 'Albert')
  test('sort objects by property with desc order does sort', users.sort(byProperty('name', 'desc'))[0].name, 'Sam')
  test('sort objects by property even if some does not have it', users.sort(byProperty('pic', 'asc'))[0].pic, 'wow.png')

  const object3 = { 'superFun': true, 'notFun': false, 'pretty-good': true, 'size': 'large' }
  test('class generator empty', genClass({}), '')
  test('class generator object', genClass(object3), 'superFun pretty-good size-large')
  test('class generator object & specific keys', genClass(object3, ['pretty-good']), 'pretty-good')
  test('class generator object & specific keys & custom class', genClass(object3, ['pretty-good'], ['nice ok']), 'nice ok pretty-good')
})
