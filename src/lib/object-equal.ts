import { objectSerialize } from './object-serializer.ts'

/**
 * Check if two objects are deeply equal
 * @param objectA the base object to compare
 * @param objectB the object to compare with
 * @param options the options
 * @param options.sortKeys if true, the order of keys will be sorted alpha before comparison
 * @returns true if the two objects are deeply equal
 */
export function objectEqual(objectA: Readonly<Record<string, unknown>>, objectB: Readonly<Record<string, unknown>>, { sortKeys = false }: Readonly<{ sortKeys?: boolean }> = {}) {
  return objectSerialize(objectA, { sortKeys }) === objectSerialize(objectB, { sortKeys })
}
