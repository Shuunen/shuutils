import { expect, it } from 'bun:test'
import { isTestEnvironment } from './shuutils'

it('isTestEnvironment A', () => {
  expect(isTestEnvironment()).toBe(true)
})
