import { objectSerialize } from './object-serializer.ts'
import { stringSum } from './strings.ts'

/**
 * Generate a unique string checksum from an object
 * @param object the object to generate checksum from
 * @param options the options
 * @param options.sortKeys if true, the order of keys will be sorted alpha before checksum
 * @returns the checksum
 */
export function objectSum(object: Readonly<Record<string, unknown>>, { sortKeys = false }: Readonly<{ sortKeys?: boolean }> = {}) {
  return stringSum(objectSerialize(object, { sortKeys }))
}
