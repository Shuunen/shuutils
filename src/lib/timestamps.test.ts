import { getTimestamp, getTimestampMs } from './timestamps'

test('specific date', () => {
  expect(getTimestamp(new Date('1989-05-14'))).toBe(611_107_200)
})

test('give positive number', () => {
  expect(getTimestamp()).toBeGreaterThan(0)
})

test('give date before year 3003', () => {
  expect(getTimestamp()).toBeLessThan(326_035_584e5)
})

test('ms of a specific date', () => {
  expect(getTimestampMs(new Date('1989-05-14'))).toBe(611_107_200_000)
})

const sizeMs = getTimestampMs().toString().length,
  sizeS = getTimestamp().toString().length

test('ms is a 1000 times bigger', () => {
  expect(sizeMs - sizeS === 3).toBe(true)
})
