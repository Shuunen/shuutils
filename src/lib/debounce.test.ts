import { debounce } from './debounce'

describe('debounce', () => {
  it('debounce A resolves with the callback result', async () => {
    const debounced = debounce((value: number) => value * 2, 5)
    await expect(debounced(21)).resolves.toBe(42)
  })
  it('debounce B only runs the callback once for a burst of calls', async () => {
    let calls = 0
    const debounced = debounce((value: number) => {
      calls += 1
      return value
    }, 5)
    void debounced(1)
    void debounced(2)
    const result = await debounced(3)
    expect(calls).toBe(1)
    expect(result).toBe(3)
  })
  it('debounce C runs again after the wait has elapsed', async () => {
    let calls = 0
    const debounced = debounce(() => {
      calls += 1
    }, 5)
    await debounced()
    await debounced()
    expect(calls).toBe(2)
  })
  it('debounce D settles every superseded call with the last result', async () => {
    let calls = 0
    const debounced = debounce((value: number) => {
      calls += 1
      return value
    }, 5)
    const results = await Promise.all([debounced(1), debounced(2), debounced(3)])
    expect(calls).toBe(1)
    expect(results).toStrictEqual([3, 3, 3])
  })
})
