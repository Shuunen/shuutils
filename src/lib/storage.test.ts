import { hasOwn } from './functions'
import { storage } from './storage'

type User = {
  age: number
  name: string
}

const key = 'Michael'
storage.media = {} as Storage

const returnTestA = storage.get(key)

test('storage returnTestA', () => {
  expect(returnTestA).toBeUndefined()
})

test('storage typeof returnTestA', () => {
  expectTypeOf(returnTestA).toBeUnknown()
})

const returnTestB = storage.get(key, 'default')

test('storage returnTestB', () => {
  expect(returnTestB).toBe('default')
})

const returnTestC = storage.get<User>(key)

test('storage returnTestC', () => {
  expect(returnTestC).toMatchInlineSnapshot(`undefined`)
})

const returnTestD = storage.get<User>(key, { age: 0, name: 'default' })

test('storage returnTestD', () => {
  expect(returnTestD).toStrictEqual({ age: 0, name: 'default' })
})

const isReturnTestE = storage.get(key, true)

test('storage returnTestE', () => {
  expect(isReturnTestE).toBe(true)
})

const returnTestF = storage.get<number>(key)

test('storage returnTestF', () => {
  expect(returnTestF).toMatchInlineSnapshot(`undefined`)
})

test('storage get without default value', () => {
  expect(storage.get(key)).toBeUndefined()
})

test('storage has no value for key', () => {
  expect(storage.has(key)).toBe(false)
})

test('storage set string value for key', () => {
  expect(storage.set(key, 'Flax')).toBe('Flax')
})

test('storage has string value for key', () => {
  expect(storage.has(key)).toBe(true)
})

test('storage set object value for key', () => {
  expect(storage.set(key, { age: 30, name: 'Michael' })).toStrictEqual({ age: 30, name: 'Michael' })
})

test('storage get object value for key', () => {
  expect(storage.get<User>(key)).toStrictEqual({ age: 30, name: 'Michael' })
})

test('storage set number value for key', () => {
  expect(storage.set(key, 30)).toBe(30)
})

test('storage get number value for key', () => {
  expect(storage.get<number>(key)).toBe(30)
})

test('storage set boolean value for key', () => {
  expect(storage.set(key, true)).toBe(true)
})

test('storage get boolean value for key', () => {
  expect(storage.get<boolean>(key)).toBe(true)
})

test('storage set array value for key', () => {
  expect(storage.set(key, [1, 2, 3])).toStrictEqual([1, 2, 3])
})

test('storage get array value for key', () => {
  expect(storage.get<number[]>(key)).toStrictEqual([1, 2, 3])
})

test('storage clear value for key', () => {
  storage.clear(key)
  expect(storage.get(key)).toBeUndefined()
})

test('storage get return undefined when key is not found', () => {
  expect(storage.get<User>('John')).toMatchInlineSnapshot(`undefined`)
})

test('storage get default value when key is not found', () => {
  expect(storage.get<User>('John', { age: 30, name: 'John' })).toStrictEqual({ age: 30, name: 'John' })
})

test('storage get default value when key is found but empty string', () => {
  expect(storage.get('myKey', 'default')).toBe('default')
})

storage.prefix = 'test-'

test('storage prefix is set', () => {
  expect(storage.prefix).toBe('test-')
})

test('storage set string value for key with prefix', () => {
  expect(storage.set(key, 'Hudson')).toBe('Hudson')
})

test('storage get string value for key with prefix', () => {
  expect(storage.get<string>(key)).toBe('Hudson')
})

test('storage set number value for key with prefix', () => {
  expect(storage.set('num', 4242)).toBe(4242)
})

test('storage get number value for key with prefix', () => {
  expect(storage.get('num')).toBe(4242)
})

test('storage has string value for key with prefix', () => {
  expect(storage.has(key)).toBe(true)
})

test('storage contains a prefixed key', () => {
  expect(hasOwn(storage.media, 'test-Michael')).toBe(true)
})

test('storage clear value for key with prefix', () => {
  storage.clear(key)
  expect(storage.get(key)).toBeUndefined()
})

const returnA = storage.get(key)

test('storage typeof returnA is undefined and TS inferred type should be unknown', () => {
  expectTypeOf(returnA).toBeUnknown()
})

const returnB = storage.get(key, 'default')

test('storage typeof returnB is string and TS inferred type should be string', () => {
  expectTypeOf(returnB).toBeString()
})

const returnC = storage.get<User>(key)

test('storage typeof returnC is undefined and TS inferred type should be User | undefined', () => {
  expectTypeOf(returnC).toExtend<User | undefined>()
})

const returnD = storage.get<User>(key, { age: 0, name: 'default' })

test('storage typeof returnD is object and TS inferred type should be User', () => {
  expectTypeOf(returnD).toBeObject()
})

const returnE = storage.get(key, true)

test('storage typeof returnE is boolean and TS inferred type should be boolean', () => {
  expectTypeOf(returnE).toBeBoolean()
})

const returnF = storage.get<number>(key)

test('storage typeof returnF is undefined and TS inferred type should be number | undefined', () => {
  expectTypeOf(returnF).toExtend<number | undefined>()
})

const returnG = storage.get(key, 12)

test('storage typeof returnG is number and TS inferred type should be number', () => {
  expectTypeOf(returnG).toBeNumber()
})

const returnH = storage.get(key, [1, 2, 3])

test('storage typeof returnH is object and TS inferred type should be number[]', () => {
  expectTypeOf(returnH).toBeObject()
})

const returnI = storage.get<number>(key, 24)

test('storage typeof returnI is number and TS inferred type should be number', () => {
  expectTypeOf(returnI).toBeNumber()
})
