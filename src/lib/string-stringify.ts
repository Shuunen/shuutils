import { objectSerialize } from './object-serializer.ts'

/**
 * Converts various data types to their string representation.
 * @param data the data to stringify
 * @param options the options
 * @param options.indent if true, the output object will be indented for better readability
 * @returns the string representation of the data
 */
export function stringify(data: unknown, { indent = false }: Readonly<{ indent?: boolean }> = {}) {
  if (data === undefined) return 'undefined'

  if (data === null) return 'null'

  if (typeof data === 'string') return data

  if (typeof data === 'object') return objectSerialize(data as Readonly<Record<string, unknown>>, { indent })

  // oxlint-disable-next-line typescript/no-base-to-string
  return String(data) //NOSONAR
}
