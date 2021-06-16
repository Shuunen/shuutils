import { deepStrictEqual as deepEqual,strictEqual as equal } from 'assert'
import { storage } from '../src'

const mock = {} as Storage

describe('storage', function () {

  it('working with a string', async function () {
    const key = 'Michael'
    const value = 'Scott'
    const exists = await storage.has(key, mock)
    equal(exists, false)
    await storage.set(key, value, mock)
    const dug = await storage.get(key, mock)
    equal(dug, value)
  })

  it('working with an object', async function () {
    const key = 'Holly'
    const value = 'Flax'
    await storage.set(key, { lastName: value }, mock)
    const exists = await storage.has(key, mock)
    equal(exists, true)
    const dug = await storage.get<{ lastName: string }>(key, mock)
    equal(dug?.lastName, value)
  })

  it('working with an array', async function () {
    const key = 'Bon'
    const value = ['Soir']
    await storage.set(key, value, mock)
    const exists = await storage.has(key, mock)
    equal(exists, true)
    const dug = await storage.get<string[]>(key, mock)
    deepEqual(dug, value)
  })

  it('save & clear', async function () {
    const key = 'Kevin'
    const value = 'Malone'
    await storage.set(key, value, mock)
    let dug = await storage.get(key, mock)
    equal(dug, value)
    storage.clear(key, mock)
    dug = await storage.get(key, mock)
    equal(dug, undefined)
  })
})
