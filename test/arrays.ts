import test from 'ava'
import { pickOne } from '../dist'

test('pick one', t => {
  const elements = ['damn', 'this', 'test', 'is', 'crazy']
  const element = pickOne(elements)
  t.true(elements.indexOf(element) > -1)
})