import test from 'ava'
import { pickOne } from '../src'

test('pick one', t => {
  const elements = ['damn', 'this', 'test', 'is', 'crazy']
  const element = pickOne(elements)
  t.true(elements.includes(element))
})
