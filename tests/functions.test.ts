import { strictEqual as equal } from 'assert'
import { debounce, sleep } from '../src'

describe('functions', () => {
  let called = false
  const myFunction = (): boolean => (called = true)
  it('debounce', async () => {
    called = false
    const myFunctionDebounced = debounce(myFunction, 100) as any
    equal(called, false)
    myFunctionDebounced()
    equal(called, false)
    await sleep(50)
    equal(called, false)
    await sleep(60)
    equal(called, true)
  })
})
