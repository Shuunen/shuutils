async function get <T = unknown> (key: string, storage = localStorage): Promise<T | undefined> {
  if (storage[key] === undefined) return
  const data = String(storage[key])
  return (['{', '['].includes(data[0])) ? JSON.parse(data) : data
}

async function set (key: string, data: string | Record<string, unknown> | unknown[], storage = localStorage): Promise<string | Record<string, unknown> | unknown[]> {
  storage[key] = typeof data === 'object' ? JSON.stringify(data) : data
  return data
}

async function has (key: string, storage = localStorage): Promise<boolean> {
  const value = await get(key, storage)
  return value !== undefined
}

function clear (key: string, storage = localStorage): void {
  /* eslint-disable-next-line @typescript-eslint/no-dynamic-delete */
  delete storage[key]
}

export const storage = { get, set, has, clear }
