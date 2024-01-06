/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */

import { objectSort } from './object-sort'

// currently handled : RegExp, Function
// to be handled later : Map, Set, undefined, Infinity, NaN, -Infinity, -0, +0, Circular references...

/**
 * Replacer function for JSON.stringify
 * @param _key the key of the object
 * @param value the value of the object
 * @returns the value of the object
 */
function replacer (_key: string, value: unknown) { // @ts-expect-error non-standard properties
  // workaround 1, see bottom note
  for (const subKey in value) if (value[subKey] instanceof Date) value[subKey] = { __strDate__: value[subKey].toISOString() } // eslint-disable-line no-param-reassign, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  if (value instanceof RegExp) return { __strRegexFlags__: value.flags, __strRegexSource__: value.source }
  if (typeof value === 'function') return { __strFunction__: value.toString() }
  // cannot do this : if (value instanceof Date) { console.log('replacer return toISOString'); return { __strDate__: value.toISOString() } } // see workaround 1
  return value
}

/**
 * Reviver function for JSON.parse
 * @param _key the key of the object
 * @param value the value of the object
 * @returns the value of the object
 */
function reviver (_key: string, value?: unknown) {
  if (typeof value !== 'object' || value === null) return value // @ts-expect-error non-standard properties
  if ('__strRegexFlags__' in value && '__strRegexSource__' in value) return new RegExp(value.__strRegexSource__, value.__strRegexFlags__) // eslint-disable-line security/detect-non-literal-regexp
  if ('__strFunction__' in value) return new Function(`return ${value.__strFunction__}`)() /* eslint-disable-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-implied-eval, no-new-func, @typescript-eslint/restrict-template-expressions */ /* @ts-expect-error non-standard properties */
  if ('__strDate__' in value) return new Date(value.__strDate__)
  return value
}

/**
 * Serializes an object to a string, using JSON.stringify with enhanced support for functions & regex
 * @param object the object to serialize to a string
 * @param willSortKeys if true, the order of keys will be sorted alpha before serialization
 * @returns the serialized object as a string
 */
export function objectSerialize (object: Readonly<Record<string, unknown>>, willSortKeys = false) {
  return JSON.stringify(willSortKeys ? objectSort(object) : object, replacer)
}

/**
 * Deserializes a string to an object, using JSON.parse with enhanced support for functions & regex
 * @param string the string to deserialize to an object
 * @returns the deserialized object
 */
export function objectDeserialize (string: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(string, reviver)
}

// workaround 1 : detecting Date objects in replacer function
// let's consider this object : { date: new Date() }, at first iteration _key is '', value is { date: 2021-01-01T00:00:00.000Z }
// note here that at this point, value is not an instance of Date, it's an object, but value.date is an instance of Date
// so because it's not a function, not a RegExp, we return value as is, so it's not serialized
// at second iteration, _key is 'date', value is "2021-01-01T00:00:00.000Z" but... now value is a string, not an object, so we cannot detect it's an instance of Date
// thank you JSON.stringify for this inconsistency -.-''
// so to be able to detect Date objects, we have to iterate over all properties of value, and check if one of them is an instance of Date
// to do it before next iteration, we have to modify value in place
