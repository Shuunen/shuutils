async function get (key: string, /* istanbul ignore next */ storage = localStorage): Promise<any | undefined> {
  const data = storage[key]
  if (data === undefined) return
  return (data[0] === '{') ? JSON.parse(data) : data
}

async function set (key: string, data: string | Record<string, unknown>, /* istanbul ignore next */ storage = localStorage): Promise<string | Record<string, unknown>> {
  storage[key] = typeof data === 'object' ? JSON.stringify(data) : data
  return data
}

async function has (key: string, /* istanbul ignore next */ storage = localStorage): Promise<boolean> {
  const value = await get(key, storage)
  return value !== undefined
}

function clear (key: string, /* istanbul ignore next */ storage = localStorage): void {
  /* eslint-disable-next-line @typescript-eslint/no-dynamic-delete */
  delete storage[key]
}

export const storage = { get, set, has, clear }
