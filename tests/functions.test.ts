import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { debounce, sleep, throttle } from '../src'

let times: number
/**
 *
 */
const myFunction = (): void => {
  times++
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

test.run()
