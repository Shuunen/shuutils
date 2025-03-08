import { expect, it } from 'bun:test'
import { Result } from './result'

it('Result.ok', () => {
  expect(Result.ok(42)).toMatchInlineSnapshot(`
    Ok {
      "ok": true,
      "value": 42,
    }
  `)
})

it('Result.error', () => {
  expect(Result.error('ay ay ay caramba !')).toMatchInlineSnapshot(`
    Err {
      "error": "ay ay ay caramba !",
      "ok": false,
    }
  `)
})

it('Result.trySafe A ok', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const result = Result.trySafe(() => JSON.parse('{"a": 42}'))
  expect(result).toMatchInlineSnapshot(`
    Ok {
      "ok": true,
      "value": {
        "a": 42,
      },
    }
  `)
})

it('Result.trySafe B error', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const result = Result.trySafe(() => JSON.parse('{"a": 42'))
  expect(result).toMatchInlineSnapshot(`
    Err {
      "error": [SyntaxError: JSON Parse error: Expected '}'],
      "ok": false,
    }
  `)
})

it('Result.trySafe C promise ok', async () => {
  const result = await Result.trySafe(Promise.resolve(42))
  expect(result).toMatchInlineSnapshot(`
    Ok {
      "ok": true,
      "value": 42,
    }
  `)
})

it('Result.unwrap A ok', () => {
  const result = Result.trySafe(() => ({ ahh: 42 }))
  const { error, value } = Result.unwrap(result)
  expect(value?.ahh).toMatchInlineSnapshot(`42`)
  expect(error).toMatchInlineSnapshot(`undefined`)
})

it('Result.unwrap B error', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const result = Result.trySafe(() => JSON.parse('{"a": 42'))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { error, value } = Result.unwrap(result)
  expect(value).toMatchInlineSnapshot(`undefined`)
  expect(error).toMatchInlineSnapshot(`[SyntaxError: JSON Parse error: Expected '}']`)
})
