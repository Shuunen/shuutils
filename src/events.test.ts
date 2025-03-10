import { expect, it, mock } from 'bun:test'
import { emit, off, on } from './events'

it('on, emit & off', () => {
  const callback = mock(() => 12)
  const listener = on('foo', callback)
  expect(callback).toHaveBeenCalledTimes(0)
  emit('foo', 42)
  emit('bar', 'wow')
  expect(callback).toHaveBeenCalledTimes(1)
  // @ts-expect-error testing purpose
  expect(callback.mock.calls[0]?.[0]).toMatchInlineSnapshot(`42`)
  off(listener)
})
