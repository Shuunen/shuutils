import { expect, it } from 'vitest'
import { isTestEnvironment } from '../src/environment'

it('isTestEnvironment A', () => { expect(isTestEnvironment()).toBe(true) })
