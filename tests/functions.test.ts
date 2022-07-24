import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { check, debounce, hasOwnProperty, sleep, throttle } from '../src'

let times: number
/**
 *
 */
const myFunction = (): void => {
  times++
}

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

test('debounce', async function () {
  times = 0
  const myFunctionDebounced = debounce(myFunction, 100)
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
check('anAsyncFuntionThatReturnAnObject A', anAsyncFunctionThatReturnAnObject(), { name: 'John', age: 30 })
check('anAsyncFuntionThatReturnAnObject B', anAsyncFunctionThatReturnAnObject(), Promise.resolve({ name: 'John', age: 30 }))

test.run()
