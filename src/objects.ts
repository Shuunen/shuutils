import { arrayUnique } from './array-unique'
import { nbAscending, nbDescending } from './constants'
import { clone } from './object-clone'
import { flatten } from './object-flatten'
import { objectSerialize } from './object-serializer'
import { stringSum } from './strings'

type GenClassTypes = boolean | null | number | string | string[] | undefined

/**
 * Access nested property
 * @param object the base object to search into
 * @param path the full path to access nested property
 * @returns the nested property value
 */
export function access(object: Readonly<Record<string, unknown>>, path: string) {
  return flatten(object)[path]
}

/**
 * Sort an array of objects by a specific property of theses objects, example :
 * ```js
 * persons.sort(byProperty('name'))
 * ```
 * @param property the property to sort by
 * @param order the order to sort, default is ascending
 * @returns the sorted array
 */
export function byProperty<Type extends Record<string, unknown>>(property: string, order: '' | 'asc' | 'desc' = '') {
  if (order === '') return () => 0
  const sortOrder = order === 'asc' ? nbAscending : nbDescending
  return (recordA: Type, recordB: Type) => {
    const valueA = recordA[property] as number // eslint-disable-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
    const valueB = recordB[property] as number // eslint-disable-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
    if (!valueA && valueB) return sortOrder
    if (valueA && !valueB) return -sortOrder
    if (valueA === valueB) return 0
    const result = valueA < valueB ? nbDescending : nbAscending
    return result * sortOrder
  }
}

/**
 * Check if a value is an object/record
 * @param value the value to check
 * @returns true if value is an object/record
 */
export function isRecord(value: unknown) {
  return value !== null && (typeof value === 'object' || typeof value === 'function') && !Array.isArray(value)
}

/**
 * Generate a unique string checksum from an object
 * @param object the object to generate checksum from
 * @param willSortKeys if true, the order of keys will be sorted alpha before checksum
 * @returns the checksum
 */
export function objectSum(object: Readonly<Record<string, unknown>>, willSortKeys = false) {
  return stringSum(objectSerialize(object, willSortKeys))
}

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types, complexity */

/**
 * Like Object.assign but only non-null/undefined values can overwrite
 * @param target Destination object
 * @param sources Object(s) to sequentially merge
 * @returns The resulting object merged
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export function safeAssign(target: Record<string, unknown>, ...sources: Readonly<Record<string, unknown>>[]) {
  if (sources.length === 0) return target
  const source = sources.shift()
  if (isRecord(target) && isRecord(source))
    for (const key in source)
      if (isRecord(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} }) // eslint-disable-line @typescript-eslint/strict-boolean-expressions
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
        safeAssign(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
      } else if (source[key] !== null && source[key] !== undefined) Object.assign(target, { [key]: source[key] })
  return safeAssign(target, ...sources)
}

/**
 * Auto-magically generate styling classes from an object
 * @param object every key-value will generate a class, ex: { enabled: true, disabled: false, size: 'large' }
 * @param keys optional, filter the keys to use
 * @param cls optional, additional classes to add, ex: "add-me"
 * @returns ready to use string class list, ex: "enabled size-large add-me"
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export function genClass(object: GenClassTypes | GenClassTypes[] | Record<string, GenClassTypes>, keys: string[] = [], cls: GenClassTypes[] = []) {
  const list = clone(cls)
  if (object === null || object === undefined) list.unshift('')
  else if (typeof object !== 'object') list.unshift(...String(object).split(' '))
  else if (Array.isArray(object)) list.unshift(...object.filter(Boolean).join(' ').split(' '))
  else {
    const finalKeys = keys.length === 0 ? Object.keys(object) : clone(keys)
    for (const key of finalKeys) {
      const value = object[key]
      if (typeof value === 'boolean' && value) list.push(key)
      else if (typeof value === 'string' && value.length > 0) list.push(`${key}-${value}`)
      else if (Array.isArray(value) && value.length > 0) list.push(`has-${key}`)
    }
  }
  return arrayUnique(list.map(String)).join(' ').trim().replace(/\s+/gu, ' ')
}
