import { strictEqual as equal } from 'assert'
import { debounce, sleep, throttle } from '../src'

describe('functions', () => {
  let times: number
  const myFunction = (): void => {
    times++
  }

  it('debounce', async () => {
    times = 0
    const myFunctionDebounced = debounce(myFunction, 100) as any
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

  it('throttle', async () => {
    times = 0
    const myFunctionThrottled = throttle(myFunction, 100) as any
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
})
