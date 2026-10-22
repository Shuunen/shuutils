import { sleep } from './sleep.ts'

describe('sleep', () => {
  it('sleep A', async () => {
    await expect(sleep(5)).resolves.toBe(5)
  })

  it('sleep B', async () => {
    await expect(sleep(7)).resolves.toBe(7)
  })
})
