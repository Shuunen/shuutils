import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { toastError, toastInfo, toastSuccess } from './browser-toast'
import { sleep } from './sleep'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

test('toastSuccess A show and hide', async () => {
  expect(document.querySelectorAll('.shu-toast')).toHaveLength(0)
  toastSuccess("And it's name is John Cena !", 10)
  const toast = document.querySelectorAll<HTMLElement>('.shu-toast')
  expect(toast).toHaveLength(1)
  expect(toast[0]?.textContent).toMatchInlineSnapshot(`"✓And it's name is John Cena !"`)
  await sleep(20)
  expect(toast[0]?.style.opacity).toBe('0')
})

test('toastInfo A', () => {
  toastInfo('This is an info message')
  const toast = document.querySelectorAll<HTMLElement>('.shu-toast')
  expect(toast).toHaveLength(2) // because of the previous test ^^'
  expect(toast[1]?.textContent).toMatchInlineSnapshot(`"iThis is an info message"`)
})

test('toastError A', () => {
  toastError('This is an error message')
  const toast = document.querySelectorAll<HTMLElement>('.shu-toast')
  expect(toast).toHaveLength(3) // because of the previous tests ^^'
  expect(toast[2]?.textContent).toMatchInlineSnapshot(`"xThis is an error message"`)
})

test('toastSuccess B should trigger show animation', async () => {
  toastSuccess('Animation test', 0)
  const toasts = document.querySelectorAll<HTMLElement>('.shu-toast'),
    lastToast = Array.from(toasts).at(-1)
  expect(lastToast?.style.opacity).toBe('0')
  await sleep(150)
  expect(lastToast?.style.opacity).toBe('1')
  expect(lastToast?.style.transform).toBe('translateX(0)')
})
