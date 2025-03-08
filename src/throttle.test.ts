import { expect, it } from 'bun:test'
import { sleep, throttle } from './shuutils'

let times = 0

/**
 * A function that increment a counter
 * @returns {number} the number of times the function has been called
 */
function myFunction() {
  times += 1
  return times
}

/**
 * An async function that return 12
 * @returns {Promise<number>} the number 12
 */
async function anAsyncFunctionThatReturn12() {
  await sleep(5)
  return 12
}

/**
 * An async function that return an object
 * @returns {Promise<{ age: number, name: string }>} an object
 */
async function anAsyncFunctionThatReturnAnObject() {
  await sleep(5)
  return {
    age: 30,
    name: 'John',
  }
}

it('throttle A', async () => {
  times = 0
  const myFunctionThrottled = throttle(myFunction, 100)
  expect(times).toBe(0)
  myFunctionThrottled()
  expect(times).toBe(1)
  myFunctionThrottled()
  myFunctionThrottled()
  myFunctionThrottled()
  expect(times).toBe(1)
  await sleep(100)
  myFunctionThrottled()
  myFunctionThrottled()
  expect(times).toBe(2)
})

it('anAsyncFunctionThatReturn12 A', async () => {
  expect(await anAsyncFunctionThatReturn12()).toBe(12)
})
it('anAsyncFunctionThatReturnAnObject A', async () => {
  expect(await anAsyncFunctionThatReturnAnObject()).toStrictEqual({ age: 30, name: 'John' })
})
