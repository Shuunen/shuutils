import { expect, it } from 'bun:test'
import { copyToClipboard, readClipboard } from './browser-clipboard'
import { sleep } from './functions'

it('copyToClipboard A no clipboard in test env', async () => {
  const result = await copyToClipboard('hello')
  expect(result).toMatchInlineSnapshot(`
    Err {
      "error": "clipboard not available",
      "ok": false,
    }
  `)
})

it('copyToClipboard B mocked clipboard', async () => {
  const clipboard = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    writeText: async (text: string) => {
      await sleep(10)
      expect(text).toBe('hello')
    },
  }
  // @ts-expect-error for testing purposes
  const result = await copyToClipboard('hello', false, clipboard)
  expect(result).toMatchInlineSnapshot(`
    Ok {
      "ok": true,
      "value": "copied to clipboard : hello",
    }
  `)
})

it('copyToClipboard C back to no clip', async () => {
  const result = await copyToClipboard('hey Jude')
  expect(result).toMatchInlineSnapshot(`
    Err {
      "error": "clipboard not available",
      "ok": false,
    }
  `)
})

it('readClipboard A no clipboard in test env', async () => {
  const result = await readClipboard()
  expect(result).toMatchInlineSnapshot(`
    Err {
      "error": "clipboard not available",
      "ok": false,
    }
  `)
})

it('readClipboard B mocked clipboard', async () => {
  const clipboard = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    readText: async () => {
      await sleep(10)
      return 'hello there !'
    },
  }
  // @ts-expect-error for testing purposes
  const result = await readClipboard(false, clipboard)
  expect(result).toMatchInlineSnapshot(`
    Ok {
      "ok": true,
      "value": "hello there !",
    }
  `)
})
