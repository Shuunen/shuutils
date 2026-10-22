import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { emit, off, on } from './events.ts'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

describe('events', () => {
  it('on, emit & off', () => {
    const callback = vi.fn<() => number>(() => 12)
    const listener = on('foo', callback)
    expect(callback).toHaveBeenCalledTimes(0)
    emit('foo', 42)
    emit('bar', 'wow')
    expect(callback).toHaveBeenCalledOnce()
    // @ts-expect-error testing purpose
    expect(callback.mock.calls[0]?.[0]).toMatchInlineSnapshot(`42`)
    off(listener)
  })

  it('emit without data', () => {
    const callback = vi.fn<() => void>()
    const listener = on('test-event', callback)
    emit('test-event')
    expect(callback).toHaveBeenCalledOnce()
    off(listener)
  })

  it('on types the emitted data', () => {
    const callback = vi.fn<(data: { id: number }) => void>()
    const listener = on<{ id: number }>('typed-event', callback)
    emit('typed-event', { id: 7 })
    expect(callback).toHaveBeenCalledWith({ id: 7 }, expect.any(CustomEvent))
    expectTypeOf(on<{ id: number }>)
      .parameter(1)
      .parameter(0)
      .toEqualTypeOf<{ id: number }>()
    off(listener)
  })

  it('on handles non-CustomEvent', () => {
    const callback = vi.fn<() => void>()
    const element = document.createElement('div')
    const listener = on('click', callback, element)
    element.click()
    expect(callback).toHaveBeenCalledOnce()
    off(listener)
  })
})
