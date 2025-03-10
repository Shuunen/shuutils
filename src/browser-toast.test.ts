import { expect, it } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { toastError, toastInfo, toastSuccess } from './browser-toast'
import { sleep } from './functions'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

it('toastSuccess A show and hide', async () => {
  expect(document.querySelectorAll('.shu-toast').length).toBe(0)
  toastSuccess("And it's name is John Cena !", 10)
  const toast = document.querySelectorAll<HTMLElement>('.shu-toast')
  expect(toast.length).toBe(1)
  expect(toast[0]?.textContent).toMatchInlineSnapshot(`"&check;And it's name is John Cena !"`)
  await sleep(10)
  expect(toast[0]?.style.opacity).toBe('0')
})

it('toastInfo A', () => {
  toastInfo('This is an info message')
  const toast = document.querySelectorAll<HTMLElement>('.shu-toast')
  expect(toast.length).toBe(2) // because of the previous test ^^'
  expect(toast[1]?.textContent).toMatchInlineSnapshot(`"iThis is an info message"`)
})

it('toastError A', () => {
  toastError('This is an error message')
  const toast = document.querySelectorAll<HTMLElement>('.shu-toast')
  expect(toast.length).toBe(3) // because of the previous tests ^^'
  expect(toast[2]?.textContent).toMatchInlineSnapshot(`"xThis is an error message"`)
})
