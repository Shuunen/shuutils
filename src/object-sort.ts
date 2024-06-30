// Based on : https://github.com/bevry/sortobject/blob/master/source/index.ts
// Copyright © Benjamin Lupton
// Artistic License 2.0

/* eslint-disable @typescript-eslint/consistent-type-assertions */

/** A typical comparator for sorting object keys */
type KeyComparator = (a: string, b: string) => number

/** An indexable object */
type IndexedObject = Record<string, unknown>

/**
 * Returns a copy of the passed array, with all nested objects within it sorted deeply by their keys, without mangling any nested arrays.
 * @param subject the unsorted array
 * @param comparator an optional comparator for sorting keys of objects
 * @returns the new sorted array
 */
export function arraySort<ArrayType extends unknown[]> (subject: ArrayType, comparator?: KeyComparator) {
  const result = []
  for (let value of subject) {
    if (value !== null && value !== undefined)
      if (Array.isArray(value)) value = arraySort(value, comparator) // eslint-disable-next-line @typescript-eslint/no-use-before-define
      else if (typeof value === 'object') value = objectSort(value as IndexedObject, comparator)
    result.push(value)
  }
  return result as ArrayType
}

/**
 * Returns a copy of the passed object, with all nested objects within it sorted deeply by their keys, without mangling any nested arrays inside of it.
 * @param subject the unsorted object
 * @param comparator an optional comparator for sorting keys of objects
 * @returns the new sorted object
 */
export function objectSort<ObjectType extends IndexedObject> (subject: ObjectType, comparator?: KeyComparator) {
  const result: IndexedObject = {} as ObjectType
  const sortedKeys = Object.keys(subject).sort(comparator)
  for (const key of sortedKeys) {
    let value = subject[key]
    if (value !== null && value !== undefined)
      if (Array.isArray(value)) value = arraySort(value, comparator)
      else if (typeof value === 'object') value = objectSort(value as IndexedObject, comparator)
    result[key] = value
  }
  return result as ObjectType
}
