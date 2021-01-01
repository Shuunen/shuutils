import { strictEqual as equal } from 'assert'
import { debounce, sleep } from '../src'

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

/*
it('sleep one second by default', async () => {
  let foo = false
  setTimeout(() => (foo = true), 900)
  await sleep()
  equal(foo, true)
  setTimeout(() => (foo = false), 400)
  await sleep(500)
  equal(foo, false)
})
*/
