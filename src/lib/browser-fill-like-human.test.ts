import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { fillLikeHuman } from './browser-fill-like-human.ts'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

describe('browser-fill-like-human', () => {
  it('fillLikeHuman A', async () => {
    const input = document.createElement('input')
    await fillLikeHuman(input, 'h')
    expect(input.value).toBe('h')
  })
})
