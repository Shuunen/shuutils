import { expect, it } from 'vitest'
import { debounce, sleep } from '../src'
import { check } from './utils'

let times = 0

/**
 * @returns {number} the number of times the function has been called
 */
function myFunction () {
  times += 1
  return times
}

const myFunctionDebounced = debounce(myFunction, 100)

/**
 * @returns {Promise<number>} the number of times the function has been called after 50ms
 */
async function myAsyncFunction () {
  await sleep(50)
  times += 1
  return times
}

const myAsyncFunctionDebounced = debounce(myAsyncFunction, 100)

it('debounce A : sync function', async function () {
  times = 0
  expect(times).toBe(0)
  void myFunctionDebounced()
  expect(times).toBe(0)
  await sleep(50)
  expect(times).toBe(0)
  await sleep(60)
  expect(times).toBe(1)
  await sleep(30)
  expect(times).toBe(1)
})

it('debounce B : async function', async function () {
  times = 0
  expect(times).toBe(0)
  void myAsyncFunctionDebounced()
  expect(times).toBe(0)
  await sleep(50)
  expect(times).toBe(0)
  await sleep(50) // the delay inside the function is 50ms
  expect(times).toBe(0)
  await sleep(60)
  expect(times).toBe(1)
  await sleep(30)
  expect(times).toBe(1)
})

check('debounce C : return type', typeof myFunctionDebounced, 'function')

check('debounce D : return type sync', Object.prototype.toString.call(myFunctionDebounced), '[object AsyncFunction]')

it('debounce E : return type sync resolve', async function () {
  times = 42
  expect(await myFunctionDebounced()).toBe(43)
})

check('debounce F : return type async', Object.prototype.toString.call(myAsyncFunctionDebounced), '[object AsyncFunction]')

it('debounce G : return type async resolve', async function () {
  times = 42
  expect(await myAsyncFunctionDebounced()).toBe(43)
})
