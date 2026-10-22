import { stringify } from './string-stringify.ts'

describe('string-stringify', () => {
  const samples = [
    { in: null, out: 'null', title: 'null' },
    { in: 'hello', out: 'hello', title: 'a string' },
    { in: 42, out: '42', title: 'a number' },
    { in: { count: 1, label: 'text' }, out: '{"count":1,"label":"text"}', title: 'an object' },
    { in: undefined, out: 'undefined', title: 'undefined' },
    { in: true, out: 'true', title: 'a boolean' },
  ]

  it.each(samples)('stringify $title', sample => {
    expect(stringify(sample.in)).toBe(sample.out)
  })

  it('stringify with indentation', () => {
    const sample = { count: 1, nested: { label: 'text', values: [1, 2, 3] } }
    expect(stringify(sample, { indent: true })).toMatchInlineSnapshot(`
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
})
