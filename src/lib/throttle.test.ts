import { sleep } from './sleep'
import { throttle } from './throttle'

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

test('throttle A', async () => {
  times = 0
  const myFunctionThrottled = throttle(myFunction, 10)
  expect(times).toBe(0)
  myFunctionThrottled()
  expect(times).toBe(1)
  myFunctionThrottled()
  myFunctionThrottled()
  myFunctionThrottled()
  expect(times).toBe(1)
  await sleep(10)
  myFunctionThrottled()
  myFunctionThrottled()
  expect(times).toBe(2)
})

let optionalCallCount = 0

/**
 * A function with an optional parameter
 * @param value - optional value parameter
 * @returns {number} the number of times the function has been called
 */
function functionWithOptionalParameter(value = 10) {
  optionalCallCount += 1
  return value + optionalCallCount
}

test('throttle B should work with functions that have optional parameters', async () => {
  optionalCallCount = 0
  const throttledFunction = throttle(functionWithOptionalParameter, 10)
  expect(optionalCallCount).toBe(0)

  // Call without parameter (uses default)
  throttledFunction()
  expect(optionalCallCount).toBe(1)

  // Call with parameter
  throttledFunction(20)
  // Should not execute due to throttling
  expect(optionalCallCount).toBe(1)

  await sleep(10)
  throttledFunction(30)
  expect(optionalCallCount).toBe(2)
})

test('anAsyncFunctionThatReturn12 A', async () => {
  await expect(anAsyncFunctionThatReturn12()).resolves.toBe(12)
})

test('anAsyncFunctionThatReturnAnObject A', async () => {
  await expect(anAsyncFunctionThatReturnAnObject()).resolves.toStrictEqual({ age: 30, name: 'John' })
})
