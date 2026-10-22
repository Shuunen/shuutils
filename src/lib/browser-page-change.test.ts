import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { onPageChange } from './browser-page-change.ts'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

describe('browser-page-change', () => {
  it('onPageChange A default callback', async () => {
    await expect(onPageChange(undefined, 10)).resolves.toBeUndefined()
  })

  it('onPageChange B callback', async () => {
    let calls = 0
    let location = ''
    function callback(href: string) {
      calls += 1
      location = href
    }
    expect(calls).toBe(0)
    expect(location).toMatchInlineSnapshot(`""`)
    await onPageChange(callback, 10)
    expect(calls).toBe(1)
    expect(location).toMatchInlineSnapshot(`"about:blank"`)
  })
})
