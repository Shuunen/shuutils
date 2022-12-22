/* eslint-disable unicorn/prefer-top-level-await */
import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { check, checksRun, sleep, throttle } from '../src'

let times = 0

/**
 * @returns {number} the number of times the function has been called
 */
function myFunction (): number {
  times += 1
  return times
}

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

check('anAsyncFunctionThatReturn12 A', anAsyncFunctionThatReturn12(), 12)
check('anAsyncFunctionThatReturn12 B', anAsyncFunctionThatReturn12(), Promise.resolve(12))
check('anAsyncFunctionThatReturnAnObject A', anAsyncFunctionThatReturnAnObject(), { name: 'John', age: 30 })
check('anAsyncFunctionThatReturnAnObject B', anAsyncFunctionThatReturnAnObject(), Promise.resolve({ name: 'John', age: 30 }))

checksRun()

