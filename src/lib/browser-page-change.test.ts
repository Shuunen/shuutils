import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { onPageChange } from './browser-page-change'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

test('onPageChange A default callback', async () => {
  await expect(onPageChange(undefined, 10)).resolves.toBeUndefined()
})

test('onPageChange B callback', async () => {
  let calls = 0,
    location = ''
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
