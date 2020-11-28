import test from 'ava'
import { getRandomImageUrl, getRandomString, slugify } from '../src'

test('slugify', t => {
  const expected = 'oh-ma-darling'
  t.is(slugify('Oh ma darling'), expected)
  t.is(slugify('Oh !ma  darling '), expected)
  t.is(slugify('  Oh %*ma  darling .?! '), expected)
  t.is(slugify(expected), expected)
})

test('random image', t => {
  t.true(getRandomImageUrl().length > 0)
})

test('random string', t => {
  t.true(getRandomString().length > 0)
})
