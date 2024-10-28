import { expect, it } from 'vitest'
import { isTestEnvironment } from '../src/shuutils'

it('isTestEnvironment A', () => {
  expect(isTestEnvironment()).toBe(true)
})
