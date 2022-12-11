import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { check, checksRun, debounce, hasOwn, sleep, throttle } from '../src'

let times = 0

/**
 * @returns {number} the number of times the function has been called
 */
function myFunction (): number {
  times += 1
  return times
}

const myFunctionDebounced = debounce(myFunction, 100)

/**
 * @returns {Promise<number>} the number of times the function has been called after 50ms
 */
async function myAsyncFunction (): Promise<number> {
  await sleep(50)
  times += 1
  return times
}

const myAsyncFunctionDebounced = debounce(myAsyncFunction, 100)

/**
 *
 */
async function anAsyncFunctionThatReturn12 (): Promise<number> {
  await sleep(5)
  return 12
}

/**
 *
 */
async function anAsyncFunctionThatReturnAnObject (): Promise<object> {
  await sleep(5)
  return {
    name: 'John',
    age: 30,
  }
}

test('debounce A : sync function', async function () {
  times = 0
  equal(times, 0)
  void myFunctionDebounced()
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
  void myAsyncFunctionDebounced()
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

check('hasOwn A', hasOwn({ propA: 1 }, 'propA'), true)
check('hasOwn B', hasOwn({ propA: 1 }, 'propB'), false)
check('hasOwn C', hasOwn({ propA: 1 }, 'toString'), false)
check('hasOwn D', hasOwn({ propA: 1 }, 'hasOwnProperty'), false)

check('sleep A', sleep(10), Promise.resolve(10))
check('sleep B', sleep(20), 20)

/* eslint-disable unicorn/prefer-top-level-await */
check('anAsyncFunctionThatReturn12 A', anAsyncFunctionThatReturn12(), 12)
check('anAsyncFunctionThatReturn12 B', anAsyncFunctionThatReturn12(), Promise.resolve(12))
check('anAsyncFunctionThatReturnAnObject A', anAsyncFunctionThatReturnAnObject(), { name: 'John', age: 30 })
check('anAsyncFunctionThatReturnAnObject B', anAsyncFunctionThatReturnAnObject(), Promise.resolve({ name: 'John', age: 30 }))
/* eslint-enable unicorn/prefer-top-level-await */

checksRun()

