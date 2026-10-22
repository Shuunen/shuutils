import { getTimestamp, getTimestampMs } from './timestamps.ts'

describe('timestamps', () => {
  it('specific date', () => {
    expect(getTimestamp(new Date('1989-05-14'))).toBe(611_107_200)
  })

  it('give positive number', () => {
    expect(getTimestamp()).toBeGreaterThan(0)
  })

  it('give date before year 3003', () => {
    expect(getTimestamp()).toBeLessThan(326_035_584e5)
  })

  it('ms of a specific date', () => {
    expect(getTimestampMs(new Date('1989-05-14'))).toBe(611_107_200_000)
  })

  const sizeMs = getTimestampMs().toString().length
  const sizeS = getTimestamp().toString().length

  it('ms is a 1000 times bigger', () => {
    expect(sizeMs - sizeS).toBe(3)
  })
})
