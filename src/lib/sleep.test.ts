import { sleep } from './sleep'

test('sleep A', async () => {
  await expect(sleep(5)).resolves.toBe(5)
})

test('sleep B', async () => {
  await expect(sleep(7)).resolves.toBe(7)
})
