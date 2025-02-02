import { expect, it } from 'vitest'
import { Result } from './result'

it('result.ok', () => {
  expect(Result.ok(42)).toMatchInlineSnapshot(`
    Ok {
      "ok": true,
      "value": 42,
    }
  `)
})

it('result.error', () => {
  expect(Result.error('ay ay ay caramba !')).toMatchInlineSnapshot(`
    Err {
      "error": "ay ay ay caramba !",
      "ok": false,
    }
  `)
})
