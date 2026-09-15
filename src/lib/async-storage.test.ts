// oxlint-disable typescript/no-dynamic-delete
import { createAsyncStorage, createInMemoryDriver, localStorageDriver } from './async-storage'
import { storage } from './storage'

// Mimics real localStorage where bracket access and getItem/removeItem share the same data
const localStorageStub = new Proxy({} as Record<string, string>, {
  deleteProperty(target, prop: string) {
    delete target[prop]
    return true
  },
  get(target, prop: string) {
    if (prop === 'removeItem')
      return (key: string) => {
        delete target[key]
      }

    if (prop === 'clear')
      return () => {
        for (const key of Object.keys(target)) delete target[key]
      }

    if (prop === 'setItem')
      return (key: string, value: string) => {
        target[key] = value
      }

    if (prop === 'getItem') return (key: string) => target[key] ?? null

    if (prop === 'length') return Object.keys(target).length

    if (prop === 'key') return (index: number) => Object.keys(target)[index] ?? null

    return target[prop]
  },
  set(target, prop: string, value: unknown) {
    target[prop] = String(value)
    return true
  },
}) as unknown as Storage

describe('async-storage', () => {
  beforeEach(() => {
    storage.media = localStorageStub
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: localStorageStub })
    localStorageStub.clear()
  })

  it('createInMemoryDriver A should set and get a value', async () => {
    const driver = createInMemoryDriver()
    await driver.set('key', 'value')
    const result = await driver.get<string>('key')
    expect(result).toMatchInlineSnapshot(`"value"`)
  })

  it('createInMemoryDriver B should return undefined for missing key', async () => {
    const driver = createInMemoryDriver(),
      result = await driver.get<string>('missing')
    expect(result).toMatchInlineSnapshot(`undefined`)
  })

  it('createInMemoryDriver C should delete a value', async () => {
    const driver = createInMemoryDriver()
    await driver.set('key', 'value')
    await driver.delete('key')
    const result = await driver.get<string>('key')
    expect(result).toMatchInlineSnapshot(`undefined`)
  })

  it('createInMemoryDriver D should isolate state between instances', async () => {
    const driverA = createInMemoryDriver(),
      driverB = createInMemoryDriver()
    await driverA.set('key', 'from-a')
    const result = await driverB.get<string>('key')
    expect(result).toMatchInlineSnapshot(`undefined`)
  })

  it('createAsyncStorage A should prefix keys when setting and getting', async () => {
    const driver = createInMemoryDriver(),
      store = createAsyncStorage('myApp', driver)
    await store.set('user', { name: 'Alice' })
    const result = await store.get<{ name: string }>('user')
    expect(result).toMatchInlineSnapshot(`
      {
        "name": "Alice",
      }
    `)
  })

  it('createAsyncStorage B should prefix keys on delete', async () => {
    const driver = createInMemoryDriver(),
      store = createAsyncStorage('myApp', driver)
    await store.set('user', 'Alice')
    await store.delete('user')
    const result = await store.get<string>('user')
    expect(result).toMatchInlineSnapshot(`undefined`)
  })

  it('createAsyncStorage C should isolate namespaces', async () => {
    const driver = createInMemoryDriver(),
      storeA = createAsyncStorage('appA', driver),
      storeB = createAsyncStorage('appB', driver)
    await storeA.set('key', 'from-a')
    const result = await storeB.get<string>('key')
    expect(result).toMatchInlineSnapshot(`undefined`)
  })

  it('localStorageDriver A should get undefined for missing key', async () => {
    const result = await localStorageDriver.get<string>('missing-key')
    expect(result).toMatchInlineSnapshot(`undefined`)
  })

  it('localStorageDriver B should set and get a value', async () => {
    await localStorageDriver.set('test-key', 'hello')
    const result = await localStorageDriver.get<string>('test-key')
    expect(result).toMatchInlineSnapshot(`"hello"`)
  })

  it('localStorageDriver C should delete a value', async () => {
    await localStorageDriver.set('del-key', 'to-delete')
    await localStorageDriver.delete('del-key')
    const result = await localStorageDriver.get<string>('del-key')
    expect(result).toMatchInlineSnapshot(`undefined`)
  })
})
