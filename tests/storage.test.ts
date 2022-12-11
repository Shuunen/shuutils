import { check, checksRun, hasOwn, storage } from '../src'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const mock = {} as Storage
interface User { name: string; age: number }
const key = 'Michael'

const returnTestA = storage.get(key, mock)
check('storage returnTestA', returnTestA)
check('storage typeof returnTestA', typeof returnTestA, 'undefined')

const returnTestB = storage.get(key, 'default', mock)
check('storage returnTestB', returnTestB, 'default')

const returnTestC = storage.get<User>(key, mock)
check('storage returnTestC', returnTestC)

const returnTestD = storage.get<User>(key, { name: 'default', age: 0 }, mock)
check('storage returnTestD', returnTestD, { name: 'default', age: 0 })

const isReturnTestE = storage.get(key, true, mock)
check('storage returnTestE', isReturnTestE, true)

const returnTestF = storage.get<number>(key, mock)
check('storage returnTestF', returnTestF)

check('storage get without default value', storage.get(key, mock))

check('storage has no value for key', storage.has(key, mock), false)
check('storage set string value for key', storage.set(key, 'Flax', mock), 'Flax')
check('storage has string value for key', storage.has(key, mock), true)

check('storage set object value for key', storage.set(key, { name: 'Michael', age: 30 }, mock), { name: 'Michael', age: 30 })
check('storage get object value for key', storage.get<User>(key, undefined, mock), { name: 'Michael', age: 30 })

check('storage set number value for key', storage.set(key, 30, mock), 30)
check('storage get number value for key', storage.get<number>(key, undefined, mock), 30)

check('storage set boolean value for key', storage.set(key, true, mock), true)
check('storage get boolean value for key', storage.get<boolean>(key, undefined, mock), true)

check('storage set array value for key', storage.set(key, [1, 2, 3], mock), [1, 2, 3])
check('storage get array value for key', storage.get<number[]>(key, undefined, mock), [1, 2, 3])

// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
check('storage clear value for key', storage.clear(key, mock))

check('storage get return undefined when key is not found', storage.get<User>('John', undefined, mock))

check('storage get default value when key is not found', storage.get<User>('John', { name: 'John', age: 30 }, mock), { name: 'John', age: 30 })

storage.prefix = 'test-'
check('storage prefix is set', storage.prefix, 'test-')
check('storage set string value for key with prefix', storage.set(key, 'Hudson', mock), 'Hudson')
check('storage get string value for key with prefix', storage.get<string>(key, undefined, mock), 'Hudson')
check('storage contains a prefixed key', hasOwn(mock, 'test-Michael'), true)
// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
check('storage clear value for key with prefix', storage.clear(key, mock))

checksRun()
