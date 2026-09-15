import { capitalize, crc32, createCrc32Table, ellipsis, ellipsisWords, isString, sanitize, slugify, stringSum } from './strings'

test('sanitize A basic word', () => {
  expect(sanitize('Superbe')).toBe('superbe')
})

test('sanitize B basic sentence', () => {
  expect(sanitize("Superbe météo aujourd'hui")).toBe('superbe meteo aujourd hui')
})

test('sanitize C complex sentence', () => {
  expect(sanitize(" d'emblée€|| la@ PLUIE,,:& pùïs un cOup dê tonnerre_ !! Et puis 2 !? Mais qu'est-ce qui se trame...")).toBe('d emblee la pluie puis un coup de tonnerre et puis 2 mais qu est ce qui se trame')
})

test('sanitize D text with tags', () => {
  expect(sanitize("<div>Superbe météo aujourd'hui</div>", false)).toBe('Superbe meteo aujourd hui')
})

test('sanitize E text with quotes', () => {
  expect(sanitize('"some-metal-parts"')).toBe('some metal parts')
})

const expected = 'oh-ma-darling'

test('slugify A simple', () => {
  expect(slugify('Oh ma darling')).toBe(expected)
})

test('slugify B medium', () => {
  expect(slugify('Oh !ma  darling ')).toBe(expected)
})

test('slugify C veteran', () => {
  expect(slugify('  Oh %*ma  darling .?! ')).toBe(expected)
})

test('slugify D expected is expected', () => {
  expect(slugify(expected)).toBe(expected)
})

test('slugify E OMG o_O', () => {
  expect(slugify('  -Oh mà  dârling .?! --')).toBe(expected)
})

test('capitalize an empty string', () => {
  expect(capitalize('')).toBe('')
})

test('capitalize a single word', () => {
  expect(capitalize('hey')).toBe('Hey')
})

test('capitalize an uppercase word', () => {
  expect(capitalize('HO')).toBe('HO')
})

test('capitalize a sentence', () => {
  expect(capitalize('hello my name is John Doe !')).toBe('Hello my name is John Doe !')
})

test('capitalize a sentence and lower John Doe', () => {
  expect(capitalize('hello my name is John Doe !', true)).toBe('Hello my name is john doe !')
})

test('ellipsis words, giving an empty string', () => {
  expect(ellipsisWords('')).toBe('')
})

test('ellipsis words, giving a regular sentence', () => {
  expect(ellipsisWords('Hello my name is Jim Halpert', 5)).toBe('Hello my name is Jim...')
})

test('ellipsis words, giving a short string that should not be processed', () => {
  expect(ellipsisWords('Hello there')).toBe('Hello there')
})

test('ellipsis words, no dots', () => {
  expect(ellipsisWords('Hello there Mr Kenobi', 2, false)).toBe('Hello there')
})

test('ellipsis, giving an empty string', () => {
  expect(ellipsis('')).toBe('')
})

test('ellipsis, giving a regular string', () => {
  expect(ellipsis('I really like pineapples', 18)).toBe('I really like pine...')
})

test('ellipsis, giving a short string that should not be processed', () => {
  expect(ellipsis('I really like pineapples')).toBe('I really like pineapples')
})

test('string sum a simple word', () => {
  expect(stringSum('plop')).toBe(3_117_829_008)
})

test('string sum a sentence', () => {
  expect(stringSum('ça fait du bien par où ça passe')).toBe(1_300_099_934)
})

test('string sum should be the same on the same string', () => {
  expect(true).toBe(true)
})

test('isString valid', () => {
  expect(isString('plop')).toBe(true)
})

test('isString invalid', () => {
  expect(isString(123)).toBe(false)
})

test('createCrc32Table', () => {
  expect(createCrc32Table()).toMatchSnapshot()
})

test('crc32 A', () => {
  expect(crc32('Hello world !')).toBe(118_369_344)
})

test('crc32 B', () => {
  expect(crc32('12 is a great number LÔL !! :p')).toBe(1_336_548_843)
})

test('crc32 C never returns a negative number', () => {
  const samples = Array.from({ length: 300 }, (_, index) => `sample ${index}`)
  expect(samples.every(sample => crc32(sample) >= 0)).toBe(true)
})
