import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { emit, off, on } from './events'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

test('on, emit & off', () => {
  const callback = vi.fn<() => number>(() => 12),
    listener = on('foo', callback)
  expect(callback).toHaveBeenCalledTimes(0)
  emit('foo', 42)
  emit('bar', 'wow')
  expect(callback).toHaveBeenCalledOnce()
  // @ts-expect-error testing purpose
  expect(callback.mock.calls[0]?.[0]).toMatchInlineSnapshot(`42`)
  off(listener)
})

test('emit without data', () => {
  const callback = vi.fn<() => void>(),
    listener = on('test-event', callback)
  emit('test-event')
  expect(callback).toHaveBeenCalledOnce()
  off(listener)
})

test('on handles non-CustomEvent', () => {
  const callback = vi.fn<() => void>(),
    element = document.createElement('div'),
    listener = on('click', callback, element)
  element.click()
  expect(callback).toHaveBeenCalledOnce()
  off(listener)
})
