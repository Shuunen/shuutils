import { ok, strictEqual as equal } from 'assert'
import { fillTemplate, getRandomImageUrl, getRandomString, slugify } from '../src'

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

  const data = {
    name: 'Wick',
    key_to_happiness: 'Roo-doo-doot-da-doo',
    quote: 'Bears. Beets. Battlestar Galactica.'
  }
  it('fill a template string without mustaches and data', () => equal(fillTemplate(data.quote), data.quote))
  it('fill an empty template string', () => equal(fillTemplate(''), ''))
  it('fill a template string with data', () => equal(fillTemplate('John {name}', data), 'John Wick'))
  it('fill a template string with long key data', () => equal(fillTemplate('Andy : {{ key_to_happiness }} !', data), `Andy : ${data.key_to_happiness} !`))
  it('fill a template string with unknown key', () => equal(fillTemplate('John {unknown_key}', data), ''))
  const objectIn = { Andy: '{{ key_to_happiness }} !' }
  const stringOut = `{
  "Andy": "${data.key_to_happiness} !"
}`
  it('fill a template object with data', () => equal(fillTemplate(objectIn, data), stringOut))
})
