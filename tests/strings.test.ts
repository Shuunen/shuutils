import { ok, strictEqual as equal } from 'assert'
import { getRandomImageUrl, getRandomString, slugify } from '../src'

describe('strings', () => {
  it('slugify', () => {
    const expected = 'oh-ma-darling'
    equal(slugify('Oh ma darling'), expected)
    equal(slugify('Oh !ma  darling '), expected)
    equal(slugify('  Oh %*ma  darling .?! '), expected)
    equal(slugify(expected), expected)
  })

  it('random image', () => ok(getRandomImageUrl().length > 0))

  it('random string', () => ok(getRandomString().length > 0))
})
