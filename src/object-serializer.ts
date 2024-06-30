/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */

import { objectSort } from './object-sort'

// currently handled :
// - array
// - boolean
// - date
// - function
// - null
// - number
// - object
// - regexp
// - string
// not handled yet :
// - circular references
// - infinity
// - map
// - nan
// - set

/**
 * Replacer function for JSON.stringify
 * @param key the key of the object
 * @param value the value of the object
 * @returns the value of the object
 */
function replacer(this: unknown, key: string, value?: Readonly<unknown>) {
  if (value === undefined) return { __strUndefined__: true }
  if (value instanceof RegExp) return { __strRegexFlags__: value.flags, __strRegexSource__: value.source }
  if (typeof value === 'function') return { __strFunction__: value.toString() }
  // cannot do this : if (value instanceof Date) { console.log('replacer return toISOString'); return { __strDate__: value.toISOString() } } // see note 1, instead we do this :
  // @ts-expect-error type issue
  if (this[key] instanceof Date) return { __strDate__: this[key].toISOString() } // eslint-disable-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  return value
}

/**
 * Reviver function for JSON.parse
 * @param _key the key of the object
 * @param value the value of the object
 * @returns the value of the object
 */
function reviver(_key: string, value?: unknown) {
  /* c8 ignore next */
  if (value === undefined || value === null) return value
  if (typeof value !== 'object') return value // @ts-expect-error non-standard properties
  if ('__strRegexFlags__' in value && '__strRegexSource__' in value) return new RegExp(value.__strRegexSource__, value.__strRegexFlags__)
  // eslint-disable-next-line no-new-func, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-implied-eval, @typescript-eslint/restrict-template-expressions
  if ('__strFunction__' in value) return new Function(`return ${value.__strFunction__}`)() /* @ts-expect-error non-standard properties */
  if ('__strDate__' in value) return new Date(value.__strDate__)
  // here we return undefined but JSON.parse will just remove the key from the object, not great but in the end it's the same result, myObject.undefinedKey will be undefined either in { undefinedKey: undefined } or in { } ... ^^'
  if ('__strUndefined__' in value) return undefined // eslint-disable-line unicorn/no-useless-undefined
  return value
}

/**
 * Serializes an object to a string, using JSON.stringify with enhanced support for functions & regex
 * @param object the object to serialize to a string
 * @param willSortKeys if true, the order of keys will be sorted alpha before serialization
 * @returns the serialized object as a string
 */
export function objectSerialize(object: Readonly<Record<string, unknown>>, willSortKeys = false) {
  return JSON.stringify(willSortKeys ? objectSort(object) : object, replacer)
}

/**
 * Deserializes a string to an object, using JSON.parse with enhanced support for functions & regex
 * @param string the string to deserialize to an object
 * @returns the deserialized object
 */
export function objectDeserialize(string: string) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return JSON.parse(string, reviver) as Record<number | string, unknown>
}

// note 1 : detecting Date objects in replacer function
// let's consider this object : { date: new Date() }, at first iteration _key is '', value is { date: 2021-01-01T00:00:00.000Z }
// note here that at this point, value is not an instance of Date, it's an object, but value.date is an instance of Date
// so because it's not a function, not a RegExp, we return value as is, so it's not serialized
// at second iteration, _key is 'date', value is "2021-01-01T00:00:00.000Z" but... now value is a string, not an object, so we cannot detect it's an instance of Date
// thank you JSON.stringify for this inconsistency -.-''
// but do you like magic ? this[key] is still an instance of Date, so we can use it to detect it's a Date object
// wow *mouth wide open*
