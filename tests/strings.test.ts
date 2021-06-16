import { ok, strictEqual as equal } from 'assert'
import { fillTemplate, getRandomImageUrl, getRandomString, slugify } from '../src'

const data = {
  name: 'Wick',
  key_ToHappiness: 'Roo-doo-doot-da-doo',
  quote: 'Bears. Beets. Battlestar Galactica.',
}
const objectIn = { Andy: '{{ key_ToHappiness }} !' }
const stringOut = `{
  "Andy": "${data.key_ToHappiness} !"
}`

describe('strings', function () {
  it('slugify', function () {
    const expected = 'oh-ma-darling'
    equal(slugify('Oh ma darling'), expected)
    equal(slugify('Oh !ma  darling '), expected)
    equal(slugify('  Oh %*ma  darling .?! '), expected)
    equal(slugify(expected), expected)
  })

  it('random image', function () { return ok(getRandomImageUrl().length > 0) })

  it('random string', function () { return ok(getRandomString().length > 0) })

  it('fill a template string without mustaches and data', function () { return equal(fillTemplate(data.quote), data.quote) })
  it('fill an empty template string', function () { return equal(fillTemplate(''), '') })
  it('fill a template string with data', function () { return equal(fillTemplate('John {name}', data), 'John Wick') })
  it('fill a template string with long key data', function () { return equal(fillTemplate('Andy : {{ key_ToHappiness }} !', data), `Andy : ${data.key_ToHappiness} !`) })
  it('fill a template string with unknown key', function () { return equal(fillTemplate('John {unknown_key}', data), '') })
  it('fill a template object with data', function () { return equal(fillTemplate(objectIn, data), stringOut) })
})
