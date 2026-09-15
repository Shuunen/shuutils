import { Result } from './result'

test('Result.ok', () => {
  expect(Result.ok(42)).toMatchInlineSnapshot(`
    Ok {
      "ok": true,
      "value": 42,
    }
  `)
})

test('Result.error', () => {
  expect(Result.error('ay ay ay caramba !')).toMatchInlineSnapshot(`
    Err {
      "error": "ay ay ay caramba !",
      "ok": false,
    }
  `)
})

test('Result.trySafe A ok', () => {
  // oxlint-disable-next-line typescript/no-unsafe-return
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

test('Result.trySafe B error', () => {
  // oxlint-disable-next-line typescript/no-unsafe-return
  const result = Result.trySafe(() => JSON.parse('{"a": 42'))
  expect(result.ok).toBe(false)
  if (!result.ok) expect(String(result.error)).toContain('SyntaxError')
})

test('Result.trySafe C promise ok', async () => {
  const result = await Result.trySafe(Promise.resolve(42))
  expect(result).toMatchInlineSnapshot(`
    Ok {
      "ok": true,
      "value": 42,
    }
  `)
})

test('Result.unwrap A ok', () => {
  const result = Result.trySafe(() => ({ ahh: 42 })),
    { error, value } = Result.unwrap(result)
  expect(value?.ahh).toMatchInlineSnapshot(`42`)
  expect(error).toMatchInlineSnapshot(`undefined`)
})

test('Result.unwrap B error', () => {
  // oxlint-disable-next-line typescript/no-unsafe-return
  const result = Result.trySafe(() => JSON.parse('{"a": 42')),
    { error, value } = Result.unwrap(result)
  expect(value).toMatchInlineSnapshot(`undefined`)
  expect(String(error)).toContain('SyntaxError')
})
