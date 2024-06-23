import { expect, it } from 'vitest'
import { getRandomNumber } from './number-random'

it('getRandomNumber 0 min by default', () => { expect(getRandomNumber() >= 0).toBe(true) })
it('getRandomNumber 100 max by default', () => { expect(getRandomNumber() <= 100).toBe(true) })
it('getRandomNumber between 22 & 122', () => { expect(getRandomNumber(22, 122) <= 122).toBe(true) })
it('getRandomNumber between 42 & 42', () => { expect(getRandomNumber(42, 42)).toBe(42) })

