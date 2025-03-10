import { expect, it } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { fillLikeHuman } from './browser-fill-like-human'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

it('fillLikeHuman A', async () => {
  const input = document.createElement('input')
  await fillLikeHuman(input, 'h')
  expect(input.value).toBe('h')
})
