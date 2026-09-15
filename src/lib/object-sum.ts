import { objectSerialize } from './object-serializer'
import { stringSum } from './strings'

/**
 * Generate a unique string checksum from an object
 * @param object the object to generate checksum from
 * @param willSortKeys if true, the order of keys will be sorted alpha before checksum
 * @returns the checksum
 */
export function objectSum(object: Readonly<Record<string, unknown>>, willSortKeys = false) {
  return stringSum(objectSerialize(object, willSortKeys))
}
