import { invariant } from './invariant.ts'
import { parseJson } from './json.ts'
import { objectDeserialize, objectSerialize } from './object-serializer.ts'

const person = {
  age: 21,
  canPush: null,
  details: { dateOfBirth: new Date('2001-12-22'), favoriteFood: 'sushi', hatedFood: undefined },
  isNameValid: true,
  name: 'John',
  nameRegex: /^jo/iu,
  nameValidator: (input: string) => input.length > 3,
  pets: ['Médoc', 'T-Rex', 'Angel'],
  petsDetails: [
    { age: 3, name: 'Médoc' },
    { age: 5, name: 'T-Rex' },
    { age: 1, name: 'Angel' },
  ],
}

function add(numberA: number, numberB: number) {
  return numberA + numberB
}

describe('object-serializer', () => {
  it('objectSerialize A string', () => {
    expect(objectSerialize({ name: 'John' })).toBe('{"name":"John"}')
  })

  it('objectSerialize B date', () => {
    expect(objectSerialize({ date: new Date('2021-01-01T00:00:00.000Z') })).toMatchInlineSnapshot(`"{"date":{"__date__":"2021-01-01T00:00:00.000Z"}}"`)
  })

  it('objectSerialize C regex', () => {
    expect(objectSerialize({ regex: /^ho\d+$/iu })).toMatchInlineSnapshot(String.raw`"{"regex":{"__regexFlags__":"iu","__regexSource__":"^ho\\d+$"}}"`)
  })

  it('objectSerialize D arrow function', () => {
    expect(objectSerialize({ func: () => 42 })).toMatchInlineSnapshot(`"{"func":{"__function__":"() => 42"}}"`)
  })

  it('objectSerialize E function', () => {
    expect(objectSerialize({ func: add })).toMatchInlineSnapshot(String.raw`"{"func":{"__function__":"function add(numberA, numberB) {\n\treturn numberA + numberB;\n}"}}"`)
  })

  it('objectSerialize F object with sort', () => {
    expect(objectSerialize({ id: 123_456, object: { age: 42, name: 'John' } }, { sortKeys: true })).toMatchInlineSnapshot('"{"id":123456,"object":{"age":42,"name":"John"}}"')
  })

  it('objectSerialize G person', () => {
    expect(objectSerialize(person)).toMatchInlineSnapshot(
      `"{"age":21,"canPush":null,"details":{"dateOfBirth":{"__date__":"2001-12-22T00:00:00.000Z"},"favoriteFood":"sushi"},"isNameValid":true,"name":"John","nameRegex":{"__regexFlags__":"iu","__regexSource__":"^jo"},"nameValidator":{"__function__":"(input) => input.length > 3"},"pets":["Médoc","T-Rex","Angel"],"petsDetails":[{"age":3,"name":"Médoc"},{"age":5,"name":"T-Rex"},{"age":1,"name":"Angel"}]}"`,
    )
  })

  it('objectSerialize H person beautified', () => {
    expect(JSON.parse(objectSerialize(person))).toMatchInlineSnapshot(`
    {
      "age": 21,
      "canPush": null,
      "details": {
        "dateOfBirth": {
          "__date__": "2001-12-22T00:00:00.000Z",
        },
        "favoriteFood": "sushi",
      },
      "isNameValid": true,
      "name": "John",
      "nameRegex": {
        "__regexFlags__": "iu",
        "__regexSource__": "^jo",
      },
      "nameValidator": {
        "__function__": "(input) => input.length > 3",
      },
      "pets": [
        "Médoc",
        "T-Rex",
        "Angel",
      ],
      "petsDetails": [
        {
          "age": 3,
          "name": "Médoc",
        },
        {
          "age": 5,
          "name": "T-Rex",
        },
        {
          "age": 1,
          "name": "Angel",
        },
      ],
    }
  `)
  })

  it('objectSerialize I handle null', () => {
    expect(objectSerialize({ nameNull: null })).toMatchInlineSnapshot('"{"nameNull":null}"')
  })

  it('objectSerialize J handle undefined', () => {
    expect(objectSerialize({ nameUndefined: undefined })).toMatchInlineSnapshot(`"{}"`)
  })

  it('objectSerialize K with sorted keys', () => {
    const object = { keyA: undefined, keyB: 2, keyC: 3 }
    const serialized = JSON.stringify(objectSerialize(object, { sortKeys: true }))
    expect(serialized).toMatchInlineSnapshot(`""{\\"keyB\\":2,\\"keyC\\":3}""`)
  })

  it('objectSerialize K2 sorts unsorted keys only when asked', () => {
    const object = parseJson<Record<string, unknown>>('{"keyB":2,"keyA":{"keyD":4,"keyC":3}}')
    invariant(object.ok, 'the unsorted sample should parse')
    expect(objectSerialize(object.value, { sortKeys: true })).toBe('{"keyA":{"keyC":3,"keyD":4},"keyB":2}')
    expect(objectSerialize(object.value)).toBe('{"keyB":2,"keyA":{"keyD":4,"keyC":3}}')
  })

  it('objectSerialize L circular reference', () => {
    const obj: Record<string, unknown> = { name: 'John' }
    obj.self = obj
    expect(objectSerialize(obj)).toMatchInlineSnapshot('"{"name":"John","self":"__circular__"}"')
  })

  it('objectSerialize M with indentation', () => {
    const sample = { count: 1, nested: { label: 'text', values: [1, 2, 3] } }
    expect(objectSerialize(sample, { indent: true })).toMatchInlineSnapshot(`
    "{
      "count": 1,
      "nested": {
        "label": "text",
        "values": [
          1,
          2,
          3
        ]
      }
    }"
  `)
  })

  it('objectSerialize N file', () => {
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' })
    expect(objectSerialize({ document: file })).toMatchInlineSnapshot(`"{"document":{"__fileName__":"test.txt","__fileSize__":12,"__fileType__":"text/plain"}}"`)
  })

  it('objectDeserialize A string', () => {
    expect(objectDeserialize('{"name":"John"}')).toMatchInlineSnapshot(`
  {
    "name": "John",
  }
`)
  })

  it('objectDeserialize B date', () => {
    const object = objectDeserialize('{"date":{"__date__":"2021-01-01T00:00:00.000Z"}}')
    expect(object).toMatchInlineSnapshot(`
    {
      "date": 2021-01-01T00:00:00.000Z,
    }
  `)
    expect(object.date instanceof Date).toBe(true)
  })

  it('objectDeserialize C regex', () => {
    const object = objectDeserialize(String.raw`{"regex":{"__regexFlags__":"iu","__regexSource__":"^ho\\d+$"}}`)
    expect(object).toMatchInlineSnapshot(`
    {
      "regex": /\\^ho\\\\d\\+\\$/iu,
    }
  `)
    // @ts-expect-error type is unknown
    // oxlint-disable-next-line typescript/no-unsafe-call
    expect(object.regex.test('ho123')).toBe(true)
  })

  it('objectDeserialize C keeps a serialized function as data by default', () => {
    expect(objectDeserialize('{"func":{"__function__":"() => 42"}}')).toStrictEqual({ func: { __function__: '() => 42' } })
  })

  it('objectDeserialize D arrow function', () => {
    const object = objectDeserialize('{"func":{"__function__":"() => 42"}}', { functions: true })
    expect(object).toMatchInlineSnapshot(`
    {
      "func": [Function],
    }
  `)
    // @ts-expect-error type is unknown
    expect(object.func()).toBe(42)
  })

  it('objectDeserialize E function', () => {
    const object = objectDeserialize(String.raw`{"func":{"__function__":"function add(numberA, numberB) {\n\treturn numberA + numberB;\n}"}}`, { functions: true })
    expect(object).toMatchInlineSnapshot(`
    {
      "func": [Function],
    }
  `)
    // @ts-expect-error type is unknown
    expect(object.func(1, 2)).toBe(3)
  })

  it('objectDeserialize F nested Date', () => {
    const object = objectDeserialize('{"age":21,"details":{"dateOfBirth":{"__date__":"2001-12-22T00:00:00.000Z"},"favoriteFood":"sushi"},"name":"John","nameValid":true}')
    expect(object).toMatchInlineSnapshot(`
    {
      "age": 21,
      "details": {
        "dateOfBirth": 2001-12-22T00:00:00.000Z,
        "favoriteFood": "sushi",
      },
      "name": "John",
      "nameValid": true,
    }
  `)
    // @ts-expect-error type is unknown
    expect(object.details.dateOfBirth instanceof Date).toBe(true)
  })

  it('objectDeserialize G does not affect original object', () => {
    const originalObject = { dateOfBirth: new Date('2001-12-22T00:00:00.000Z'), name: 'John' }
    const string = objectSerialize(originalObject)
    const deserializedObject = objectDeserialize(string)
    expect(originalObject).toMatchInlineSnapshot(`
    {
      "dateOfBirth": 2001-12-22T00:00:00.000Z,
      "name": "John",
    }
  `)
    expect(deserializedObject).toMatchInlineSnapshot(`
    {
      "dateOfBirth": 2001-12-22T00:00:00.000Z,
      "name": "John",
    }
  `)
  })

  it('objectDeserialize H person', () => {
    const object = objectDeserialize(
      '{"age":21,"canPush":null,"details":{"dateOfBirth":{"__date__":"2001-12-22T00:00:00.000Z"},"favoriteFood":"sushi","hatedFood":null},"isNameValid":true,"name":"John","nameRegex":{"__regexFlags__":"iu","__regexSource__":"^jo"},"nameValidator":{"__function__":"(input) => input.length > 3"},"pets":["Médoc","T-Rex","Angel"],"petsDetails":[{"age":3,"name":"Médoc"},{"age":5,"name":"T-Rex"},{"age":1,"name":"Angel"}]}',
      { functions: true },
    )
    expect(object).toMatchInlineSnapshot(`
    {
      "age": 21,
      "canPush": null,
      "details": {
        "dateOfBirth": 2001-12-22T00:00:00.000Z,
        "favoriteFood": "sushi",
        "hatedFood": null,
      },
      "isNameValid": true,
      "name": "John",
      "nameRegex": /\\^jo/iu,
      "nameValidator": [Function],
      "pets": [
        "Médoc",
        "T-Rex",
        "Angel",
      ],
      "petsDetails": [
        {
          "age": 3,
          "name": "Médoc",
        },
        {
          "age": 5,
          "name": "T-Rex",
        },
        {
          "age": 1,
          "name": "Angel",
        },
      ],
    }
  `)
    // the snapshot shows the Date and RegExp instances, only their behavior is left to check
    const { nameRegex, nameValidator } = object as { nameRegex: RegExp; nameValidator: (input: string) => boolean }
    expect([nameRegex.test('John'), nameValidator('Jo'), nameValidator('John')]).toStrictEqual([true, false, true])
  })

  it('objectDeserialize I simple', () => {
    const serialized = '{"keyA":{"__strUndefined__":true},"keyB":2,"keyC":3}'
    const object = objectDeserialize(serialized)
    expect(object).toMatchInlineSnapshot(`
    {
      "keyA": {
        "__strUndefined__": true,
      },
      "keyB": 2,
      "keyC": 3,
    }
  `)
  })

  it('objectDeserialize J file partial revive', () => {
    /**
     * We cannot restore the content of the file because it would require the serializer to async read the file data
     * so for now we just restore the File object with name, size and type
     */
    const object = objectDeserialize('{"document":{"__fileName__":"test.txt","__fileSize__":12,"__fileType__":"text/plain"}}')
    expect(object.document instanceof File).toBe(true)
    // @ts-expect-error type is unknown
    expect(object.document.name).toBe('test.txt')
    // @ts-expect-error type is unknown
    expect(object.document.size).toBe(0)
    // @ts-expect-error type is unknown
    expect(object.document.type).toBe('text/plain')
  })
})
