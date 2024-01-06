/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect, it } from 'vitest'
import { objectDeserialize, objectSerialize } from '../src/object-serializer'

function add (numberA: number, numberB: number) { return numberA + numberB }

it('objectSerialize A string', () => { expect(objectSerialize({ name: 'John' })).toBe('{"name":"John"}') })
it('objectSerialize B date', () => { expect(objectSerialize({ date: new Date('2021-01-01T00:00:00.000Z') })).toMatchInlineSnapshot('"{"date":{"__strDate__":"2021-01-01T00:00:00.000Z"}}"') })
it('objectSerialize C regex', () => { expect(objectSerialize({ regex: /^ho\d+$/iu })).toMatchInlineSnapshot('"{"regex":{"__strRegexFlags__":"iu","__strRegexSource__":"^ho\\\\d+$"}}"') })
it('objectSerialize D arrow function', () => { expect(objectSerialize({ func: () => 42 })).toMatchInlineSnapshot('"{"func":{"__strFunction__":"() => 42"}}"') })
it('objectSerialize E function', () => { expect(objectSerialize({ func: add })).toMatchInlineSnapshot('"{"func":{"__strFunction__":"function add(numberA, numberB) {\\n  return numberA + numberB;\\n}"}}"') })
it('objectSerialize F object with sort', () => { expect(objectSerialize({ object: { name: 'John', age: 42 }, id: 123_456 }, true)).toMatchInlineSnapshot('"{"id":123456,"object":{"age":42,"name":"John"}}"') })  // eslint-disable-line perfectionist/sort-objects

it('objectDeserialize A string', () => {
  expect(objectDeserialize('{"name":"John"}')).toMatchInlineSnapshot(`
  {
    "name": "John",
  }
`)
})
it('objectDeserialize B date', () => {
  const object = objectDeserialize('{"date":{"__strDate__":"2021-01-01T00:00:00.000Z"}}')
  expect(object).toMatchInlineSnapshot(`
    {
      "date": 2021-01-01T00:00:00.000Z,
    }
  `)
  expect(object.date instanceof Date).toBe(true)
})
it('objectDeserialize C regex', () => {
  const object = objectDeserialize('{"regex":{"__strRegexFlags__":"iu","__strRegexSource__":"^ho\\\\d+$"}}')
  expect(object).toMatchInlineSnapshot(`
    {
      "regex": /\\^ho\\\\d\\+\\$/iu,
    }
  `)
  expect(object.regex.test('ho123')).toBe(true)
})
it('objectDeserialize D arrow function', () => {
  const object = objectDeserialize('{"func":{"__strFunction__":"() => 42"}}')
  expect(object).toMatchInlineSnapshot(`
    {
      "func": [Function],
    }
  `)
  expect(object.func()).toBe(42)
})
it('objectDeserialize E function', () => {
  const object = objectDeserialize('{"func":{"__strFunction__":"function add(numberA, numberB) {\\n  return numberA + numberB;\\n}"}}')
  expect(object).toMatchInlineSnapshot(`
    {
      "func": [Function],
    }
  `)
  expect(object.func(1, 2)).toBe(3)
})
