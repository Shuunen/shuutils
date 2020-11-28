import test from 'ava'
import { debounce, sleep } from '../src'

let called = false
const myFunction = (): boolean => (called = true)
test('debounce', async (t) => {
  called = false
  const myFunctionDebounced = debounce(myFunction, 1000) as any
  t.is(called, false)
  myFunctionDebounced()
  t.is(called, false)
  await sleep(500)
  t.is(called, false)
  await sleep(600)
  t.is(called, true)
})

test('sleep one second by default', async (t) => {
  let foo = false
  setTimeout(() => (foo = true), 900)
  await sleep()
  t.is(foo, true)
  setTimeout(() => (foo = false), 400)
  await sleep(500)
  t.is(foo, false)
})
