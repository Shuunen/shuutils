import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { check, checksRun, debounce, hasOwnProperty, sleep, throttle } from '../src'

let times: number

/**
 * @returns {number} the number of times the function has been called
 */
const myFunction = (): number => {
  return ++times
}

const myFunctionDebounced = debounce(myFunction, 100)

/**
 * @returns {Promise<number>} the number of times the function has been called after 50ms
 */
const myAsyncFunction = async (): Promise<number> => {
  await sleep(50)
  return ++times
}

const myAsyncFunctionDebounced = debounce(myAsyncFunction, 100)

/**
 *
 */
const anAsyncFunctionThatReturn12 = async (): Promise<number> => {
  return 12
}

/**
 *
 */
const anAsyncFunctionThatReturnAnObject = async (): Promise<object> => {
  return { name: 'John', age: 30 }
}

test('debounce A : sync function', async function () {
  times = 0
  equal(times, 0)
  myFunctionDebounced()
  equal(times, 0)
  await sleep(50)
  equal(times, 0)
  await sleep(60)
  equal(times, 1)
  await sleep(30)
  equal(times, 1)
})

test('debounce B : async function', async function () {
  times = 0
  equal(times, 0)
  myAsyncFunctionDebounced()
  equal(times, 0)
  await sleep(50)
  equal(times, 0)
  await sleep(50) // the delay inside the function is 50ms
  equal(times, 0)
  await sleep(60)
  equal(times, 1)
  await sleep(30)
  equal(times, 1)
})

check('debounce C : return type', typeof myFunctionDebounced, 'function')

check('debounce D : return type sync', Object.prototype.toString.call(myFunctionDebounced), '[object AsyncFunction]')

test('debounce E : return type sync resolve', async function () {
  times = 42
  equal(await myFunctionDebounced(), 43)
})

check('debounce F : return type async', Object.prototype.toString.call(myAsyncFunctionDebounced), '[object AsyncFunction]')

test('debounce G : return type async resolve', async function () {
  times = 42
  equal(await myAsyncFunctionDebounced(), 43)
})

test('throttle', async function () {
  times = 0
  const myFunctionThrottled = throttle(myFunction, 100)
  equal(times, 0)
  myFunctionThrottled()
  equal(times, 1)
  myFunctionThrottled()
  myFunctionThrottled()
  myFunctionThrottled()
  equal(times, 1)
  await sleep(100)
  myFunctionThrottled()
  myFunctionThrottled()
  equal(times, 2)
})

check('hasOwnProperty A', hasOwnProperty({ a: 1 }, 'a'), true)
check('hasOwnProperty B', hasOwnProperty({ a: 1 }, 'b'), false)
check('hasOwnProperty C', hasOwnProperty({ a: 1 }, 'toString'), false)
check('hasOwnProperty D', hasOwnProperty({ a: 1 }, 'hasOwnProperty'), false)

check('sleep A', sleep(10), Promise.resolve(10))
check('sleep B', sleep(20), 20)

check('anAsyncFunctionThatReturn12 A', anAsyncFunctionThatReturn12(), 12)
check('anAsyncFunctionThatReturn12 B', anAsyncFunctionThatReturn12(), Promise.resolve(12))
check('anAsyncFunctionThatReturnAnObject A', anAsyncFunctionThatReturnAnObject(), { name: 'John', age: 30 })
check('anAsyncFunctionThatReturnAnObject B', anAsyncFunctionThatReturnAnObject(), Promise.resolve({ name: 'John', age: 30 }))

checksRun()
