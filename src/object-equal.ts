import { objectSerialize } from './object-serializer'

/**
 * Check if two objects are deeply equal
 * @param objectA the base object to compare
 * @param objectB the object to compare with
 * @returns true if the two objects are deeply equal
 */
export function objectEqual (objectA: Readonly<Record<string, unknown>>, objectB: Readonly<Record<string, unknown>>) {
  return objectSerialize(objectA) === objectSerialize(objectB)
}
