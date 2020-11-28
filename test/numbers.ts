import test from 'ava'
import { getRandomNumber } from '../src'

test('random number between defaults', t => {
  const min = 0
  const max = 100
  const number = getRandomNumber()
  t.true(number >= min)
  t.true(number <= max)
})

test('random number between range', t => {
  const min = 22
  const max = 122
  const number = getRandomNumber(min, max)
  t.true(number >= min)
  t.true(number <= max)
})

test('random number not random', t => {
  const min = 42
  const number = getRandomNumber(min, min)
  t.true(number === min)
})
