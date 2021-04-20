import { strictEqual as equal } from 'assert'
import { storage } from '../src'

describe('storage', () => {
  const mock = {} as Storage

  it('working with a string', async () => {
    const key = 'Michael'
    const value = 'Scott'
    const exists = await storage.has(key, mock)
    equal(exists, false)
    await storage.set(key, value, mock)
    const dug = await storage.get(key, mock)
    equal(dug, value)
  })

  it('working with an object', async () => {
    const key = 'Holly'
    const value = 'Flax'
    await storage.set(key, { lastName: value }, mock)
    const exists = await storage.has(key, mock)
    equal(exists, true)
    const dug = await storage.get(key, mock)
    equal(dug.lastName, value)
  })

  it('working with an array', async () => {
    const key = 'Bon'
    const value = ['Soir']
    await storage.set(key, value, mock)
    const exists = await storage.has(key, mock)
    equal(exists, true)
    const dug = await storage.get(key, mock)
    equal(dug[0], value[0])
  })

  it('save & clear', async () => {
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
