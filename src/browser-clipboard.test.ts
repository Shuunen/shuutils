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

it('copyToClipboard B un-stringifyable data', async () => {
  /* eslint-disable jsdoc/require-jsdoc, @typescript-eslint/naming-convention */
  const objectThatCannotBeStringified = {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    toJSON: () => {
      // eslint-disable-next-line no-restricted-syntax
      throw new Error('cannot be stringified')
    },
  }
  /* eslint-enable jsdoc/require-jsdoc, @typescript-eslint/naming-convention */
  const result = await copyToClipboard(objectThatCannotBeStringified)
  expect(result).toMatchInlineSnapshot(`
    Err {
      "error": "failed to stringify the data",
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
