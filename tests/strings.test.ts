import { ok, strictEqual as equal } from 'assert'
import { capitalize, ellipsis, ellipsisWords, fillTemplate, getRandomImageUrl, getRandomString, isJSON, slugify } from '../src'
import { test } from './utils'

const data = {
  name: 'Wick',
  key_ToHappiness: 'Roo-doo-doot-da-doo',
  quote: 'Bears. Beets. Battlestar Galactica.',
  details: {
    pinCode: 3544,
  },
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

  test('fill a template string without mustaches and data', fillTemplate(data.quote), data.quote)
  test('fill an empty template string', fillTemplate(''), '')
  test('fill a template string with data', fillTemplate('John {name}', data), 'John Wick')
  test('fill a template string with long key data', fillTemplate('Andy : {{ key_ToHappiness }} !', data), `Andy : ${data.key_ToHappiness} !`)
  test('fill a template string with unknown key', fillTemplate('John {unknown_key}', data), 'John {unknown_key}')
  test('fill a template object with data', fillTemplate(objectIn, data), stringOut)
  test('fill a template string with deep data', fillTemplate('My code is {{details.pinCode}}', data), 'My code is 3544')

  test('capitalize an empty string', capitalize(''), '')
  test('capitalize a single word', capitalize('hey'), 'Hey')
  test('capitalize an uppercased word', capitalize('HO'), 'HO')
  test('capitalize a sentence', capitalize('hello my name is John Doe !'), 'Hello my name is John Doe !')

  test('ellipsis words, giving an empty string', ellipsisWords(''), '')
  test('ellipsis words, giving a regular sentence', ellipsisWords('Hello my name is Jim Halpert', 5), 'Hello my name is Jim...')
  test('ellipsis words, giving a short string that should not be processed', ellipsisWords('Hello there'), 'Hello there')

  test('ellipsis, giving an empty string', ellipsis(''), '')
  test('ellipsis, giving a regular string', ellipsis('I really like pineapples', 18), 'I really like pine...')
  test('ellipsis, giving a short string that should not be processed', ellipsis('I really like pineapples'), 'I really like pineapples')

  test('valid JSON', isJSON('{ "name": "John Doe" }'), { name: 'John Doe' })
  test('invalid JSON', isJSON('"name": "John Doe" }'), false)
  test('un-parse-able JSON', isJSON('{"name" "John Doe" }'), false)
})
