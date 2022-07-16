import { test } from 'uvu'
import { ok } from 'uvu/assert'
import { pickOne, shuffleArray } from '../src'

test('pick one', function () {
  const elements = ['damn', 'this', 'test', 'is', 'crazy']
  const element = pickOne(elements)
  ok(elements.includes(element))
})

test('shuffle an array without affecting the original one', function (){
  const elements = ['damn', 'this', 'test', 'is', 'crazy']
  const elementsShuffled = shuffleArray(elements)
  ok(elements[0] === 'damn' && elements[2] === 'test')
  ok((elementsShuffled[0] !== 'damn') || (elementsShuffled[2] !== 'test'))
})

test.run()
