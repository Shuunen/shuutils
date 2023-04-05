/* eslint-disable etc/no-assign-mutated-array */
/* eslint-disable @typescript-eslint/naming-convention */
import { expect, it } from 'vitest'
import { access, byProperty, clone, flatten, genClass, isRecord, objectSum, safeAssign } from '../src'

const person = { name: 'John', age: 21, details: { favoriteFood: 'sushi' } }
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
it('flatten an object containing an array', () => { expect(flatten({ name: 'John', collection: ['pikachu', 'drake'] })).toStrictEqual({ 'name': 'John', 'collection[0]': 'pikachu', 'collection[1]': 'drake' }) })

const users = [{ name: 'John', age: 21, pic: 'wow.png' }, { name: 'Albert', age: 42 }, { name: 'Sam', age: 22 }, { name: 'Birgit', age: 11 }]
it('sort objects by property without order does not sort', () => { expect(users.sort(byProperty('name'))[0]?.name).toBe('John') })
it('sort objects by property with asc order does sort', () => { expect(users.sort(byProperty('name', 'asc'))[0]?.name).toBe('Albert') })
it('sort objects by property with desc order does sort', () => { expect(users.sort(byProperty('name', 'desc'))[0]?.name).toBe('Sam') })
it('sort objects by property even if some does not have it', () => { expect(users.sort(byProperty('pic', 'asc'))[0]?.pic).toBe('wow.png') })

const object3 = { 'superFun': true, 'notFun': false, 'pretty-good': true, 'size': 'large' }
// eslint-disable-next-line unicorn/no-useless-undefined
it('class generator undefined', () => { expect(genClass(undefined)).toBe('') })
it('class generator null', () => { expect(genClass(null)).toBe('') }) // eslint-disable-line unicorn/no-null
it('class generator empty string', () => { expect(genClass('')).toBe('') })
it('class generator string', () => { expect(genClass('one 2   three')).toBe('one 2 three') })
it('class generator string with cls', () => { expect(genClass('one 2   three', [], ['enabled', 2])).toBe('one 2 three enabled') })
it('class generator empty', () => { expect(genClass({})).toBe('') })
it('class generator object', () => { expect(genClass(object3)).toBe('superFun pretty-good size-large') })
it('class generator object & specific keys', () => { expect(genClass(object3, ['pretty-good'])).toBe('pretty-good') })
it('class generator object & specific keys & custom class', () => { expect(genClass(object3, ['pretty-good'], ['nice ok'])).toBe('nice ok pretty-good') })
it('class generator object containing array', () => { expect(genClass({ status: ['visible', 'enabled'] })).toBe('has-status') })
it('class generator object containing empty array', () => { expect(genClass({ status: [] })).toBe('') })
it('class generator array', () => { expect(genClass(['one one ', 2, null, 'one', undefined, '   three '])).toBe('one 2 three') }) // eslint-disable-line unicorn/no-null

/* eslint-disable prefer-object-spread, putout/putout */
it('object assign A simple', () => { expect(Object.assign({ name: 'John' }, { name: 'Claire' })).toStrictEqual({ name: 'Claire' }) })
it('object assign B limitation, overwrite with undefined', () => { expect(Object.assign({ name: 'John', age: 31 }, { name: 'Claire', age: undefined })).toStrictEqual({ name: 'Claire', age: undefined }) })
it('object assign C limitation, overwrite with null', () => { expect(Object.assign({ name: 'John', age: 31 }, { name: 'Claire', age: null })).toStrictEqual({ name: 'Claire', age: null }) }) // eslint-disable-line unicorn/no-null
it('object assign D limitation, loose side data', () => { expect(Object.assign({ name: 'John', details: { age: 42, type: 'years' } }, { name: 'Claire', details: { age: 21 } })).toStrictEqual({ name: 'Claire', details: { age: 21 } }) })
/* eslint-enable prefer-object-spread, putout/putout */

it('safe assign A simple', () => { expect(safeAssign({ name: 'John' }, { name: 'Claire' })).toStrictEqual({ name: 'Claire' }) })
it('safe assign B does not overwrite with undefined', () => { expect(safeAssign({ name: 'John', age: 31 }, { name: 'Claire', age: undefined })).toStrictEqual({ name: 'Claire', age: 31 }) })
it('safe assign C does not overwrite with null', () => { expect(safeAssign({ name: 'John', age: 31 }, { name: 'Claire', age: null })).toStrictEqual({ name: 'Claire', age: 31 }) }) // eslint-disable-line unicorn/no-null
it('safe assign D does not loose side data', () => { expect(safeAssign({ name: 'John', details: { age: 42, type: 'years' } }, { name: 'Claire', details: { age: 21 } })).toStrictEqual({ name: 'Claire', details: { age: 21, type: 'years' } }) })
it('safe assign E 2nd param undefined', () => { expect(safeAssign({ name: 'John' })).toStrictEqual({ name: 'John' }) })
it('safe assign F 2nd param empty object', () => { expect(safeAssign({ name: 'John' }, {})).toStrictEqual({ name: 'John' }) })
it('safe assign G 2nd param overwrite', () => { expect(safeAssign({ name: 'John' }, { name: 'Claire' })).toStrictEqual({ name: 'Claire' }) })
it('safe assign H does overwrite with empty string', () => { expect(safeAssign({ name: 'John', age: 31 }, { name: '' })).toStrictEqual({ name: '', age: 31 }) })
it('safe assign I does not overwrite with empty object', () => { expect(safeAssign({ name: 'John', details: { age: 42, type: 'years' } }, { name: '', details: {} })).toStrictEqual({ name: '', details: { age: 42, type: 'years' } }) })
it('safe assign J does handle non existing sub object', () => { expect(safeAssign({ name: 'John' }, { details: { age: 42, type: 'years' } })).toStrictEqual({ name: 'John', details: { age: 42, type: 'years' } }) })

it('isRecord on null', () => { expect(isRecord(null)).toBe(false) }) // eslint-disable-line unicorn/no-null
it('isRecord on an array', () => { expect(isRecord([1, 2])).toBe(false) })
it('isRecord on an empty array', () => { expect(isRecord([])).toBe(false) })
it('isRecord on an empty string', () => { expect(isRecord('')).toBe(false) })
it('isRecord on a number', () => { expect(isRecord(-1)).toBe(false) })
it('isRecord on an empty record', () => { expect(isRecord({})).toBe(true) })
it('isRecord on a record', () => { expect(isRecord({ name: 'John' })).toBe(true) })

it('objectSum on empty object', () => { expect(objectSum({})).toBe(2_745_614_147) })
it('objectSum is the same on two equally empty objects', () => { expect(objectSum({}) === objectSum(clone({}))).toBe(true) })
it('objectSum on object with numbers', () => { expect(objectSum({ keyA: 1, keyB: 2, keyC: 3 })).toBe(2_822_221_177) })
it('objectSum on object with a slightly different number', () => { expect(objectSum({ keyA: 1, keyB: 2, keyC: 4 })).toBe(3_883_285_438) })
it('objectSum on object with a slightly different key', () => { expect(objectSum({ keyA: 1, keyD: 2, keyC: 3 })).toBe(1_855_582_140) })
it('objectSum on a large object', () => { expect(objectSum({ abyss: 1, backInTime: 'was a good movie', clearlyHugeObjectThere: 33_514_149_687, details: {}, propE: 5, propF: 6, propG: 7, propH: 8, propI: 9, propJ: 10, users, object3 })).toBe(1_861_045_962) })
it('objectSum is the same on two equals objects', () => { expect(objectSum(object3) === objectSum(clone(object3))).toBe(true) })

