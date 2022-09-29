import { access, byProperty, check, checksRun, clone, copy, flatten, genClass, isRecord, objectSum, safeAssign } from '../src'

const person = { name: 'John', age: 21, details: { favoriteFood: 'sushi' } }
const personCopy = copy(person)
personCopy.age = 42
check('copy a record', personCopy.age, 42)
check('copy a record does not affect the original one', person.age, 21)

const persons = ['John', 'Fanny']
const personsCopy = copy(persons)
personsCopy[1] = 'Bob'
check('copy an array', personsCopy[1], 'Bob')
check('copy an array does not affect the original one', persons[1], 'Fanny')

check('clone is a better name', copy(person), clone(person))

check('nested existing property access', access(person, 'details.favoriteFood'), 'sushi')
check('nested non-existing property access', typeof access(person, 'details.favoriteDrink'), 'undefined')
check('access a non-nested property', access({ name: 'John Cena' }, 'name'), 'John Cena')
check('access a non-existing non-nested property', typeof access({ name: 'John Cena' }, 'age'), 'undefined')
check('access a non-nested property after an undefined property', access({ age: undefined, name: 'John Cena' }, 'name'), 'John Cena')

check('flatten an object', flatten(person), { 'age': 21, 'details.favoriteFood': 'sushi', 'name': 'John' })
check('flatten an object with a custom root path', flatten(person, 'person'), { 'person.age': 21, 'person.details.favoriteFood': 'sushi', 'person.name': 'John' })
check('flatten an object containing an array', flatten({ name: 'John', collection: ['pikachu', 'drake'] }), { 'name': 'John', 'collection[0]': 'pikachu', 'collection[1]': 'drake' })

const users = [{ name: 'John', age: 21, pic: 'wow.png' }, { name: 'Albert', age: 42 }, { name: 'Sam', age: 22 }, { name: 'Birgit', age: 11 }]
check('sort objects by property without order does not sort', users.sort(byProperty('name'))[0]?.name, 'John')
check('sort objects by property with asc order does sort', users.sort(byProperty('name', 'asc'))[0]?.name, 'Albert')
check('sort objects by property with desc order does sort', users.sort(byProperty('name', 'desc'))[0]?.name, 'Sam')
check('sort objects by property even if some does not have it', users.sort(byProperty('pic', 'asc'))[0]?.pic, 'wow.png')

const object3 = { 'superFun': true, 'notFun': false, 'pretty-good': true, 'size': 'large' }
check('class generator empty', genClass({}), '')
check('class generator bad object', genClass(undefined as unknown as Record<string, unknown>), '')
check('class generator object', genClass(object3), 'superFun pretty-good size-large')
check('class generator object & specific keys', genClass(object3, ['pretty-good']), 'pretty-good')
check('class generator object & specific keys & custom class', genClass(object3, ['pretty-good'], ['nice ok']), 'nice ok pretty-good')
check('class generator object containing array', genClass({ status: ['visible', 'enabled'] }), 'has-status')
check('class generator object containing empty array', genClass({ status: [] }), '')
check('class generator array', genClass(['one one ', 2, null, 'one', undefined, '   three ']), 'one 2 three') // eslint-disable-line unicorn/no-null

check('object assign A simple', Object.assign({ name: 'John' }, { name: 'Claire' }), { name: 'Claire' })
check('object assign B limitation, overwrite with undefined', Object.assign({ name: 'John', age: 31 }, { name: 'Claire', age: undefined }), { name: 'Claire', age: undefined })
check('object assign C limitation, overwrite with null', Object.assign({ name: 'John', age: 31 }, { name: 'Claire', age: null }), { name: 'Claire', age: null }) // eslint-disable-line unicorn/no-null
check('object assign D limitation, loose side data', Object.assign({ name: 'John', details: { age: 42, type: 'years' } }, { name: 'Claire', details: { age: 21 } }), { name: 'Claire', details: { age: 21 } })

check('safe assign A simple', safeAssign({ name: 'John' }, { name: 'Claire' }), { name: 'Claire' })
check('safe assign B does not overwrite with undefined', safeAssign({ name: 'John', age: 31 }, { name: 'Claire', age: undefined }), { name: 'Claire', age: 31 })
check('safe assign C does not overwrite with null', safeAssign({ name: 'John', age: 31 }, { name: 'Claire', age: null }), { name: 'Claire', age: 31 }) // eslint-disable-line unicorn/no-null
check('safe assign D does not loose side data', safeAssign({ name: 'John', details: { age: 42, type: 'years' } }, { name: 'Claire', details: { age: 21 } }), { name: 'Claire', details: { age: 21, type: 'years' } })
check('safe assign E 2nd param undefined', safeAssign({ name: 'John' }), { name: 'John' })
check('safe assign F 2nd param empty object', safeAssign({ name: 'John' }, {}), { name: 'John' })
check('safe assign G 2nd param overwrite', safeAssign({ name: 'John' }, { name: 'Claire' }), { name: 'Claire' })
check('safe assign H does overwrite with empty string', safeAssign({ name: 'John', age: 31 }, { name: '' }), { name: '', age: 31 })
check('safe assign I does not overwrite with empty object', safeAssign({ name: 'John', details: { age: 42, type: 'years' } }, { name: '', details: {} }), { name: '', details: { age: 42, type: 'years' } })
check('safe assign J does handle non existing sub object', safeAssign({ name: 'John' }, { details: { age: 42, type: 'years' } }), { name: 'John', details: { age: 42, type: 'years' } })

check('isRecord on null', isRecord(null), false) // eslint-disable-line unicorn/no-null
check('isRecord on an array', isRecord([1, 2]), false)
check('isRecord on an empty array', isRecord([]), false)
check('isRecord on an empty string', isRecord(''), false)
check('isRecord on a number', isRecord(-1), false)
check('isRecord on an empty record', isRecord({}), true)
check('isRecord on a record', isRecord({ name: 'John' }), true)

check('objectSum on empty object', objectSum({}), 2_745_614_147)
check('objectSum is the same on two equally empty objects', objectSum({}) === objectSum({}), true)
check('objectSum on object with numbers', objectSum({ a: 1, b: 2, c: 3 }), 785_669_035)
check('objectSum on object with a slightly different number', objectSum({ a: 1, b: 2, c: 5 }), 2_022_636_589)
check('objectSum on object with a slightly different key', objectSum({ a: 1, d: 2, c: 3 }), 3_328_283_112)
check('objectSum on a large object', objectSum({ abyss: 1, backInTime: 'was a good movie', clearlyHugeObjectThere: 33_514_149_687, details: {}, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10, users, object3 }), 4_236_592_105)
check('objectSum is the same on two equals objects', objectSum(object3) === objectSum(object3), true)

checksRun()
