import { round } from './number-round'

test('round A', () => {
  expect(round(1.2345, 2)).toBe(1.23)
})

test('round B', () => {
  expect(round(1.2355, 2)).toBe(1.24)
})

test('round C', () => {
  expect(round(1.2355, 0)).toBe(1)
})

test('round D', () => {
  expect(round(1.2355, 1)).toBe(1.2)
})

test('round E', () => {
  expect(round(1.2355, 3)).toBe(1.236)
})

test('round F', () => {
  expect(round(1.2355)).toBe(1.24)
})
