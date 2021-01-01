import { ok } from 'assert'
import { pickOne } from '../src'

it('pick one', () => {
  const elements = ['damn', 'this', 'test', 'is', 'crazy']
  const element = pickOne(elements)
  ok(elements.includes(element))
})
