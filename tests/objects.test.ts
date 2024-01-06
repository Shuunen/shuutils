/* eslint-disable etc/no-assign-mutated-array */
/* eslint-disable @typescript-eslint/naming-convention */
import { expect, it } from 'vitest'
import { access, byProperty, clone, flatten, genClass, isRecord, objectSum, safeAssign } from '../src'
import { objectEqual } from '../src/object-equal'

const person = { age: 21, details: { favoriteFood: 'sushi' }, name: 'John' }
const personCopy = clone(person)
personCopy.age = 42
it('clone a record', () => { expect(personCopy.age).toBe(42) })
it('clone a record does not affect the original one', () => { expect(person.age).toBe(21) })

const persons = ['John', 'Fanny']
const personsCopy = clone(persons)
personsCopy[1] = 'Bob'
it('clone an array', () => { expect(personsCopy[1]).toBe('Bob') })
it('clone an array does not affect the original one', () => { expect(persons[1]).toBe('Fanny') })

it('clone is a better name', () => { expect(clone(person)).toStrictEqual(clone(person)) })

it('nested existing property access', () => { expect(access(person, 'details.favoriteFood')).toBe('sushi') })
it('nested non-existing property access', () => { expect(typeof access(person, 'details.favoriteDrink')).toBe('undefined') })
it('access a non-nested property', () => { expect(access({ name: 'John Cena' }, 'name')).toBe('John Cena') })
it('access a non-existing non-nested property', () => { expect(typeof access({ name: 'John Cena' }, 'age')).toBe('undefined') })
it('access a non-nested property after an undefined property', () => { expect(access({ age: undefined, name: 'John Cena' }, 'name')).toBe('John Cena') })

it('flatten an object', () => { expect(flatten(person)).toStrictEqual({ 'age': 21, 'details.favoriteFood': 'sushi', 'name': 'John' }) })
it('flatten an object with a custom root path', () => { expect(flatten(person, 'person')).toStrictEqual({ 'person.age': 21, 'person.details.favoriteFood': 'sushi', 'person.name': 'John' }) })
it('flatten an object containing an array', () => { expect(flatten({ collection: ['pikachu', 'drake'], name: 'John' })).toStrictEqual({ 'collection[0]': 'pikachu', 'collection[1]': 'drake', 'name': 'John' }) })

const users = [{ age: 21, name: 'John', pic: 'wow.png' }, { age: 42, name: 'Albert' }, { age: 22, name: 'Sam' }, { age: 11, name: 'Birgit' }]
it('sort objects by property without order does not sort', () => { expect(users.sort(byProperty('name'))[0]?.name).toBe('John') })
it('sort objects by property with asc order does sort', () => { expect(users.sort(byProperty('name', 'asc'))[0]?.name).toBe('Albert') })
it('sort objects by property with desc order does sort', () => { expect(users.sort(byProperty('name', 'desc'))[0]?.name).toBe('Sam') })
it('sort objects by property even if some does not have it', () => { expect(users.sort(byProperty('pic', 'asc'))[0]?.pic).toBe('wow.png') })

const object3 = { 'notFun': false, 'pretty-good': true, 'size': 'large', 'superFun': true }
// eslint-disable-next-line unicorn/no-useless-undefined
it('class generator A undefined', () => { expect(genClass(undefined)).toBe('') })
it('class generator B null', () => { expect(genClass(null)).toBe('') }) // eslint-disable-line unicorn/no-null
it('class generator C empty string', () => { expect(genClass('')).toBe('') })
it('class generator D string', () => { expect(genClass('one 2   three')).toBe('one 2 three') })
it('class generator E string with cls', () => { expect(genClass('one 2   three', [], ['enabled', 2])).toBe('one 2 three enabled') })
it('class generator F empty', () => { expect(genClass({})).toBe('') })
it('class generator G object', () => { expect(genClass(object3)).toMatchInlineSnapshot('"pretty-good size-large superFun"') })
it('class generator H object & specific keys', () => { expect(genClass(object3, ['pretty-good'])).toBe('pretty-good') })
it('class generator I object & specific keys & custom class', () => { expect(genClass(object3, ['pretty-good'], ['nice ok'])).toBe('nice ok pretty-good') })
it('class generator J object containing array', () => { expect(genClass({ status: ['visible', 'enabled'] })).toBe('has-status') })
it('class generator K object containing empty array', () => { expect(genClass({ status: [] })).toBe('') })
it('class generator L array', () => { expect(genClass(['one one ', 2, null, 'one', undefined, '   three '])).toBe('one 2 three') }) // eslint-disable-line unicorn/no-null

/* eslint-disable prefer-object-spread */
it('object assign A simple', () => { expect(Object.assign({ name: 'John' }, { name: 'Claire' })).toStrictEqual({ name: 'Claire' }) })
it('object assign B limitation, overwrite with undefined', () => { expect(Object.assign({ age: 31, name: 'John' }, { age: undefined, name: 'Claire' })).toStrictEqual({ age: undefined, name: 'Claire' }) })
it('object assign C limitation, overwrite with null', () => { expect(Object.assign({ age: 31, name: 'John' }, { age: null, name: 'Claire' })).toStrictEqual({ age: null, name: 'Claire' }) }) // eslint-disable-line unicorn/no-null
it('object assign D limitation, loose side data', () => { expect(Object.assign({ details: { age: 42, type: 'years' }, name: 'John' }, { details: { age: 21 }, name: 'Claire' })).toStrictEqual({ details: { age: 21 }, name: 'Claire' }) })
/* eslint-enable prefer-object-spread */

it('safe assign A simple', () => { expect(safeAssign({ name: 'John' }, { name: 'Claire' })).toStrictEqual({ name: 'Claire' }) })
it('safe assign B does not overwrite with undefined', () => { expect(safeAssign({ age: 31, name: 'John' }, { age: undefined, name: 'Claire' })).toStrictEqual({ age: 31, name: 'Claire' }) })
it('safe assign C does not overwrite with null', () => { expect(safeAssign({ age: 31, name: 'John' }, { age: null, name: 'Claire' })).toStrictEqual({ age: 31, name: 'Claire' }) }) // eslint-disable-line unicorn/no-null
it('safe assign D does not loose side data', () => { expect(safeAssign({ details: { age: 42, type: 'years' }, name: 'John' }, { details: { age: 21 }, name: 'Claire' })).toStrictEqual({ details: { age: 21, type: 'years' }, name: 'Claire' }) })
it('safe assign E 2nd param undefined', () => { expect(safeAssign({ name: 'John' })).toStrictEqual({ name: 'John' }) })
it('safe assign F 2nd param empty object', () => { expect(safeAssign({ name: 'John' }, {})).toStrictEqual({ name: 'John' }) })
it('safe assign G 2nd param overwrite', () => { expect(safeAssign({ name: 'John' }, { name: 'Claire' })).toStrictEqual({ name: 'Claire' }) })
it('safe assign H does overwrite with empty string', () => { expect(safeAssign({ age: 31, name: 'John' }, { name: '' })).toStrictEqual({ age: 31, name: '' }) })
it('safe assign I does not overwrite with empty object', () => { expect(safeAssign({ details: { age: 42, type: 'years' }, name: 'John' }, { details: {}, name: '' })).toStrictEqual({ details: { age: 42, type: 'years' }, name: '' }) })
it('safe assign J does handle non existing sub object', () => { expect(safeAssign({ name: 'John' }, { details: { age: 42, type: 'years' } })).toStrictEqual({ details: { age: 42, type: 'years' }, name: 'John' }) })

it('isRecord A on null', () => { expect(isRecord(null)).toBe(false) }) // eslint-disable-line unicorn/no-null
it('isRecord B on an array', () => { expect(isRecord([1, 2])).toBe(false) })
it('isRecord C on an empty array', () => { expect(isRecord([])).toBe(false) })
it('isRecord D on an empty string', () => { expect(isRecord('')).toBe(false) })
it('isRecord E on a number', () => { expect(isRecord(-1)).toBe(false) })
it('isRecord F on an empty record', () => { expect(isRecord({})).toBe(true) })
it('isRecord G on a record', () => { expect(isRecord({ name: 'John' })).toBe(true) })

const object4 = { foo: { bar: 'foo', regex: /^ho\d+$/iu }, keyA: 1, keyB: 2, keyC: 3 }
const object4ButAnotherReference = { foo: { bar: 'foo', regex: /^ho\d+$/iu }, keyA: 1, keyB: 2, keyC: 3 }
const object4ButDeepRegexDifferent = { foo: { bar: 'foo', regex: /^oh\d+$/iu }, keyA: 1, keyB: 2, keyC: 3 }
it('objectSum A on empty object', () => { expect(objectSum({})).toMatchInlineSnapshot('2745614147') })
it('objectSum B is the same on two equally empty objects', () => { expect(objectSum({ name: 'john' }) === objectSum(clone({ name: 'john' }))).toBe(true) })
it('objectSum C on object with numbers', () => { expect(objectSum({ keyA: 1, keyB: 2, keyC: 3 })).toMatchInlineSnapshot('2822221177') })
it('objectSum D on object with a slightly different number', () => { expect(objectSum({ keyA: 1, keyB: 2, keyC: 4 })).toMatchInlineSnapshot('3883285438') })
it('objectSum E on object with a slightly different key', () => { expect(objectSum({ keyA: 1, keyC: 3, keyD: 2 })).toMatchInlineSnapshot('1603108510') })
it('objectSum F on a large object', () => { expect(objectSum({ abyss: 1, backInTime: 'was a good movie', clearlyHugeObjectThere: 33_514_149_687, details: {}, object3, propE: 5, propF: 6, propG: 7, propH: 8, propI: 9, propJ: 10, users })).toMatchInlineSnapshot('3077461858') })
it('objectSum G is the same on two equals objects', () => { expect(objectSum(object3) === objectSum(clone(object3))).toBe(true) })
it('objectSum H is the same on two equals objects with nested objects', () => { expect(objectSum(object4) === objectSum(object4ButAnotherReference)).toBe(true) })
it('objectSum I is different with a deep slight modification', () => { expect(objectSum(object4) !== objectSum(object4ButDeepRegexDifferent)).toBe(true) })

it('objectEqual A true for empty objects', () => { expect(objectEqual({}, {})).toBe(true) })
it('objectEqual B true for objects with same keys', () => { expect(objectEqual({ keyA: 1, keyB: 2, keyC: 3 }, { keyA: 1, keyB: 2, keyC: 3 })).toBe(true) })
it('objectEqual C false for objects with different keys', () => { expect(objectEqual({ keyA: 1, keyB: 2, keyC: 3 }, { keyA: 1, keyB: 2, keyD: 3 })).toBe(false) })
it('objectEqual D false for objects with different values', () => { expect(objectEqual({ keyA: 1, keyB: 2, keyC: 3 }, { keyA: 1, keyB: 2, keyC: 4 })).toBe(false) })
it('objectEqual E true with objects containing same literals', () => { expect(objectEqual({ bar: 2, foo: 1 }, { bar: 2, foo: 1 })).toBe(true) })
it('objectEqual F true for deeply nested objects', () => { expect(objectEqual({ foo: { bar: 'foo', regex: /^ho\d+$/iu } }, { foo: { bar: 'foo', regex: /^ho\d+$/iu } })).toBe(true) })
it('objectEqual H false with objects containing different literals', () => { expect(objectEqual({ bar: 1, foo: 1 }, { bar: 2, foo: 1 })).toBe(false) })
it('objectEqual I true with same objects but different references', () => { expect(objectEqual(object4, object4ButAnotherReference)).toBe(true) })
