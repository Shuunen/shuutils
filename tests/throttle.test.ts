import { expect, it } from 'vitest'
import { sleep, throttle } from '../src'
import { check } from './utils'

let times = 0

function myFunction () {
  times += 1
  return times
}

async function anAsyncFunctionThatReturn12 () {
  await sleep(5)
  return 12
}

async function anAsyncFunctionThatReturnAnObject () {
  await sleep(5)
  return {
    name: 'John',
    age: 30,
  }
}

it('throttle', async function () {
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

check('anAsyncFunctionThatReturn12 A', anAsyncFunctionThatReturn12(), 12)
check('anAsyncFunctionThatReturn12 B', anAsyncFunctionThatReturn12(), Promise.resolve(12))
check('anAsyncFunctionThatReturnAnObject A', anAsyncFunctionThatReturnAnObject(), { name: 'John', age: 30 })
check('anAsyncFunctionThatReturnAnObject B', anAsyncFunctionThatReturnAnObject(), Promise.resolve({ name: 'John', age: 30 }))


