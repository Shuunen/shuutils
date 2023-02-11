import { hasOwn, storage } from '../src'
import { check } from './utils'

interface User { name: string; age: number }
const key = 'Michael'
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
storage.media = {} as Storage

const returnTestA = storage.get(key)
check('storage returnTestA', returnTestA)
check('storage typeof returnTestA', typeof returnTestA, 'undefined')

const returnTestB = storage.get(key, 'default')
check('storage returnTestB', returnTestB, 'default')

const returnTestC = storage.get<User>(key)
check('storage returnTestC', returnTestC)

const returnTestD = storage.get<User>(key, { name: 'default', age: 0 })
check('storage returnTestD', returnTestD, { name: 'default', age: 0 })

const isReturnTestE = storage.get(key, true)
check('storage returnTestE', isReturnTestE, true)

const returnTestF = storage.get<number>(key)
check('storage returnTestF', returnTestF)

check('storage get without default value', storage.get(key))

check('storage has no value for key', storage.has(key), false)
check('storage set string value for key', storage.set(key, 'Flax'), 'Flax')
check('storage has string value for key', storage.has(key), true)

check('storage set object value for key', storage.set(key, { name: 'Michael', age: 30 }), { name: 'Michael', age: 30 })
check('storage get object value for key', storage.get<User>(key), { name: 'Michael', age: 30 })

check('storage set number value for key', storage.set(key, 30), 30)
check('storage get number value for key', storage.get<number>(key), 30)

check('storage set boolean value for key', storage.set(key, true), true)
check('storage get boolean value for key', storage.get<boolean>(key), true)

check('storage set array value for key', storage.set(key, [1, 2, 3]), [1, 2, 3])
check('storage get array value for key', storage.get<number[]>(key), [1, 2, 3])

// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
check('storage clear value for key', storage.clear(key))

check('storage get return undefined when key is not found', storage.get<User>('John'))

check('storage get default value when key is not found', storage.get<User>('John', { name: 'John', age: 30 }), { name: 'John', age: 30 })

storage.prefix = 'test-'
check('storage prefix is set', storage.prefix, 'test-')
check('storage set string value for key with prefix', storage.set(key, 'Hudson'), 'Hudson')
check('storage get string value for key with prefix', storage.get<string>(key), 'Hudson')
check('storage has string value for key with prefix', storage.has(key), true)
check('storage contains a prefixed key', hasOwn(storage.media, 'test-Michael'), true)
// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
check('storage clear value for key with prefix', storage.clear(key))

const returnA = storage.get(key)
check('storage typeof returnA is undefined and TS inferred type should be unknown', typeof returnA, 'undefined')

const returnB = storage.get(key, 'default')
check('storage typeof returnB is string and TS inferred type should be string', typeof returnB, 'string')

const returnC = storage.get<User>(key)
check('storage typeof returnC is undefined and TS inferred type should be User | undefined', typeof returnC, 'undefined')

const returnD = storage.get<User>(key, { name: 'default', age: 0 })
check('storage typeof returnD is object and TS inferred type should be User', typeof returnD, 'object')

// eslint-disable-next-line @typescript-eslint/naming-convention
const returnE = storage.get(key, true)
check('storage typeof returnE is boolean and TS inferred type should be boolean', typeof returnE, 'boolean')

const returnF = storage.get<number>(key)
check('storage typeof returnF is undefined and TS inferred type should be number | undefined', typeof returnF, 'undefined')

const returnG = storage.get(key, 12)
check('storage typeof returnG is number and TS inferred type should be number', typeof returnG, 'number')

const returnH = storage.get(key, [1, 2, 3])
check('storage typeof returnH is object and TS inferred type should be number[]', typeof returnH, 'object')

const returnI = storage.get<number>(key, 24)
check('storage typeof returnI is number and TS inferred type should be number', typeof returnI, 'number')

