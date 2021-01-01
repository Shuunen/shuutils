import { strictEqual as equal } from 'assert'
import { clear, get, has, set } from '../src/storage'

describe('storage', () => {
  const storage = {} as Storage

  it('working with a string', async () => {
    const key = 'Michael'
    const value = 'Scott'
    const exists = await has(key, storage)
    equal(exists, false)
    await set(key, value, storage)
    const dug = await get(key, storage)
    equal(dug, value)
  })

  it('working with an object', async () => {
    const key = 'Holly'
    const value = 'Flax'
    await set(key, { lastName: value }, storage)
    const exists = await has(key, storage)
    equal(exists, true)
    const dug = await get(key, storage)
    equal(dug.lastName, value)
  })

  it('save & clear', async () => {
    const key = 'Kevin'
    const value = 'Malone'
    await set(key, value, storage)
    let dug = await get(key, storage)
    equal(dug, value)
    clear(key, storage)
    dug = await get(key, storage)
    equal(dug, undefined)
  })
})
