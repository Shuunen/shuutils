import { expect, it } from 'vitest'
import { isTestEnvironment } from '../src'

it('isTestEnvironment A', () => {
  expect(isTestEnvironment()).toBe(true)
})
