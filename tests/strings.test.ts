import { test } from 'uvu'
import { capitalize, ellipsis, ellipsisWords, fillTemplate, getRandomImageUrl, getRandomString, isJSON, sanitize, slugify } from '../src'
import { check } from './utils'

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

check('sanitize a basic word', sanitize('Superbe'), 'superbe')
check('sanitize a basic sentence', sanitize('Superbe météo aujourd\'hui'), 'superbe meteo aujourd hui')
check('sanitize a complex sentence', sanitize(' d\'emblée€|| la@ PLUIE,,:& pùïs un cOup dê tonnerre_ !! Et puis 2 !? Mais qu\'est-ce qui se trame...'), 'd emblee la pluie puis un coup de tonnerre et puis 2 mais qu est ce qui se trame')

const expected = 'oh-ma-darling'
check('slugify A simple', slugify('Oh ma darling'), expected)
check('slugify B medium', slugify('Oh !ma  darling '), expected)
check('slugify C veteran', slugify('  Oh %*ma  darling .?! '), expected)
check('slugify D expected is expected', slugify(expected), expected)
check('slugify E OMG o_O', slugify('  -Oh mà  dârling .?! --'), expected)

check('random image', getRandomImageUrl().length > 0, true)
check('random string', getRandomString().length > 0, true)

check('fill a template string without mustaches and data', fillTemplate(data.quote), data.quote)
check('fill an empty template string', fillTemplate(''), '')
check('fill a template string with data', fillTemplate('John {name}', data), 'John Wick')
check('fill a template string with long key data', fillTemplate('Andy : {{ key_ToHappiness }} !', data), `Andy : ${data.key_ToHappiness} !`)
check('fill a template string with unknown key', fillTemplate('John {unknown_key}', data), 'John {unknown_key}')
check('fill a template object with data', fillTemplate(objectIn, data), stringOut)
check('fill a template string with deep data', fillTemplate('My code is {{details.pinCode}}', data), 'My code is 3544')

check('capitalize an empty string', capitalize(''), '')
check('capitalize a single word', capitalize('hey'), 'Hey')
check('capitalize an uppercased word', capitalize('HO'), 'HO')
check('capitalize a sentence', capitalize('hello my name is John Doe !'), 'Hello my name is John Doe !')

check('capitalize a sentence and lower John Doe', capitalize('hello my name is John Doe !', true), 'Hello my name is john doe !')
check('capitalize a sentence and lower SUPER-CAM', capitalize('SUPER-CAM Universal Remote Control 433 mhz Key Fob duplicator DOORMAT Transmitter', true), 'SUPER-CAM universal remote control 433 mhz key fob duplicator DOORMAT transmitter')
check('capitalize a sentence and lower DOORMAT', capitalize('Universal Remote Control 433 mhz Key Fob duplicator DOORMAT Transmitter', true), 'Universal remote control 433 mhz key fob duplicator DOORMAT transmitter')

check('ellipsis words, giving an empty string', ellipsisWords(''), '')
check('ellipsis words, giving a regular sentence', ellipsisWords('Hello my name is Jim Halpert', 5), 'Hello my name is Jim...')
check('ellipsis words, giving a short string that should not be processed', ellipsisWords('Hello there'), 'Hello there')

check('ellipsis, giving an empty string', ellipsis(''), '')
check('ellipsis, giving a regular string', ellipsis('I really like pineapples', 18), 'I really like pine...')
check('ellipsis, giving a short string that should not be processed', ellipsis('I really like pineapples'), 'I really like pineapples')

check('valid JSON', isJSON('{ "name": "John Doe" }'), { name: 'John Doe' })
check('invalid JSON', isJSON('"name": "John Doe" }'), false)
check('un-parse-able JSON', isJSON('{"name" "John Doe" }'), false)

test.run()
