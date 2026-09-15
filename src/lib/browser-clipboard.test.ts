import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { copyToClipboard, readClipboard } from './browser-clipboard'
import { invariant } from './invariant'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

const originalClipboard = globalThis.navigator?.clipboard

function setClipboard(clipboard: unknown) {
  Object.defineProperty(globalThis.navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  })
}

describe('browser-clipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    setClipboard(undefined)
  })

  afterEach(() => {
    setClipboard(originalClipboard)
    vi.restoreAllMocks()
  })

  it('copyToClipboard A should return an error when clipboard is unavailable', async () => {
    const result = await copyToClipboard('hello')
    expect(result).toMatchInlineSnapshot(`
      Err {
        "error": "clipboard not available",
        "ok": false,
      }
    `)
  })

  it('copyToClipboard B should return an error when data cannot be stringified', async () => {
    const objectThatCannotBeStringified = {
        toJSON() {
          throw new Error('cannot be stringified')
        },
      },
      result = await copyToClipboard(objectThatCannotBeStringified)
    expect(result).toMatchInlineSnapshot(`
      Err {
        "error": "failed to stringify the data",
        "ok": false,
      }
    `)
  })

  it('copyToClipboard C should write text and log when requested', async () => {
    const mockClipboard = {
      writeText: vi.fn<(text: string) => void>(() => undefined),
    }
    setClipboard(mockClipboard)
    const spy = vi.spyOn(console, 'log').mockImplementation(() => ({})),
      result = await copyToClipboard('log this', true)
    expect(result).toMatchInlineSnapshot(`
      Ok {
        "ok": true,
        "value": "copied to clipboard : log this",
      }
    `)
    expect(mockClipboard.writeText).toHaveBeenCalledExactlyOnceWith('log this')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('copying to clipboard'))
  })

  it('readClipboard A should return an error when clipboard is unavailable', async () => {
    const result = await readClipboard()
    expect(result).toMatchInlineSnapshot(`
      Err {
        "error": "clipboard not available",
        "ok": false,
      }
    `)
  })

  it('readClipboard B should return text from the clipboard', async () => {
    const mockClipboard = {
      readText: vi.fn<() => string>(() => 'hello there !'),
    }
    setClipboard(mockClipboard)
    const result = await readClipboard()
    expect(result).toMatchInlineSnapshot(`
      Ok {
        "ok": true,
        "value": "hello there !",
      }
    `)
  })

  it('readClipboard C should log and return the clipboard text', async () => {
    const mockClipboard = {
      readText: vi.fn<() => string>(() => 'logged text'),
    }
    setClipboard(mockClipboard)
    const spy = vi.spyOn(console, 'log').mockImplementation(() => ({})),
      result = await readClipboard(true)
    invariant(result.ok, 'expected result to be ok')
    expect(result.value).toBe('logged text')
    expect(spy).toHaveBeenCalledWith('reading clipboard...')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('got this text from clipboard'))
  })

  it('readClipboard D should return an error when readText fails', async () => {
    const mockClipboard = {
      readText: vi.fn<() => string>(() => {
        throw new Error('read failed')
      }),
    }
    setClipboard(mockClipboard)
    const result = await readClipboard(false)
    expect(result).toMatchInlineSnapshot(`
      Err {
        "error": "clipboard not available",
        "ok": false,
      }
    `)
  })
})
