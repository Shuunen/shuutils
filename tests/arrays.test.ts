import { ok } from 'assert'
import { pickOne } from '../src'

describe('arrays', function () {
  it('pick one', function () {
    const elements = ['damn', 'this', 'test', 'is', 'crazy']
    const element = pickOne(elements)
    ok(elements.includes(element))
  })
})
