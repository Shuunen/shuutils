import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { check, debounce, sleep } from '../src'

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
