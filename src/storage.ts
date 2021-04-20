/* istanbul ignore next */
async function get(key: string, storage = localStorage): Promise<any | undefined> {
  const data = storage[key]
  if (data === undefined) return
  return (['{', '['].includes(data[0])) ? JSON.parse(data) : data
}

/* istanbul ignore next */
async function set(key: string, data: string | Record<string, unknown> | unknown[], storage = localStorage): Promise<string | Record<string, unknown> | unknown[]> {
  storage[key] = typeof data === 'object' ? JSON.stringify(data) : data
  return data
}

/* istanbul ignore next */
async function has(key: string, storage = localStorage): Promise<boolean> {
  const value = await get(key, storage)
  return value !== undefined
}

/* istanbul ignore next */
function clear(key: string, storage = localStorage): void {
  /* eslint-disable-next-line @typescript-eslint/no-dynamic-delete */
  delete storage[key]
}

export const storage = { get, set, has, clear }
