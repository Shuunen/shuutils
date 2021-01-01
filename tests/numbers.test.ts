import { ok } from 'assert'
import { getRandomNumber } from '../src'

it('random number between defaults', () => {
  const min = 0
  const max = 100
  const number = getRandomNumber()
  ok(number >= min)
  ok(number <= max)
})

it('random number between range', () => {
  const min = 22
  const max = 122
  const number = getRandomNumber(min, max)
  ok(number >= min)
  ok(number <= max)
})

it('random number not random', () => {
  const min = 42
  const number = getRandomNumber(min, min)
  ok(number === min)
})
