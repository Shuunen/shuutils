import { expect, it } from 'bun:test'
import { isBrowserEnvironment, isTestEnvironment } from './shuutils'

it('isTestEnvironment A', () => {
  expect(isTestEnvironment()).toBe(true)
})

it('isBrowserEnvironment A we want dev env by default to not be detected as browser', () => {
  expect(isBrowserEnvironment()).toBe(false)
})

it('isBrowserEnvironment B by skipping the isHappyDom guard, the dev env is indeed detected as browser', () => {
  expect(isBrowserEnvironment('hey')).toBe(true)
})
