import { ok } from 'assert'
import { test } from 'uvu'
import { pickOne } from '../src'

test('pick one', function () {
  const elements = ['damn', 'this', 'test', 'is', 'crazy']
  const element = pickOne(elements)
  ok(elements.includes(element))
})

test.run()
