import { nbSpacesIndent } from './constants.ts'
import { isRecord } from './object-is-record.ts'
import { objectSort } from './object-sort.ts'

// currently handled :
// - array
// - boolean
// - circular references
// - date
// - file
// - function
// - null
// - number
// - object
// - regexp
// - string
// not handled yet :
// - infinity
// - map
// - nan
// - set

// the marker keys of the serialized format, stored in json by consumers, so they must never change
const markers = {
  date: '__date__',
  fileName: '__fileName__',
  fileSize: '__fileSize__',
  fileType: '__fileType__',
  function: '__function__',
  regexFlags: '__regexFlags__',
  regexSource: '__regexSource__',
} as const

/**
 * Replacer function for JSON.stringify
 * @param this the context object
 * @param key the key of the object
 * @param value the value of the object
 * @returns the value of the object
 */
function replacer(this: unknown, key: string, value?: unknown) {
  if (value === undefined) return value

  if (value instanceof RegExp) return { [markers.regexFlags]: value.flags, [markers.regexSource]: value.source }

  if (typeof value === 'function') return { [markers.function]: value.toString() }

  // @ts-expect-error type issue
  if (this[key] instanceof File)
    // @ts-expect-error type issue
    return { [markers.fileName]: this[key].name, [markers.fileSize]: this[key].size, [markers.fileType]: this[key].type }

  // cannot do this : if (value instanceof Date) { console.log('replacer return toISOString'); return { __strDate__: value.toISOString() } } // see note 1, instead we do this :
  // @ts-expect-error type issue
  if (this[key] instanceof Date)
    // @ts-expect-error type issue
    // oxlint-disable-next-line typescript/no-unsafe-call
    return { [markers.date]: this[key].toISOString() }

  return value
}

const createCircularReplacer = () => {
  const seen = new WeakSet<object>()
  /**
   * Replacer function for JSON.stringify with circular reference handling
   * @param this the context object
   * @param key the key being stringified
   * @param value the value being stringified
   * @returns the value to serialize
   */
  function circularReplacer(this: unknown, key: string, value?: unknown) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '__circular__'

      seen.add(value)
    }
    return replacer.call(this, key, value)
  }
  return circularReplacer
}

/**
 * Detect function for JSON.parse reviver
 * @param value an unknown value
 * @returns the type of this value like : "empty", "date"...
 */
function detect(value?: unknown) /* NOSONAR */ {
  if (value === undefined || value === null || typeof value !== 'object') return 'not-object'

  if (markers.regexFlags in value && markers.regexSource in value) return 'regex'

  if (markers.function in value) return 'function'

  if (markers.fileName in value && markers.fileSize in value && markers.fileType in value) return 'file'

  if (markers.date in value) return 'date'

  return 'unknown'
}

type SerializedRegex = Record<typeof markers.regexFlags | typeof markers.regexSource, string>

type SerializedFunction = Record<typeof markers.function, string>

type SerializedFile = Record<typeof markers.fileName | typeof markers.fileType, string> & Record<typeof markers.fileSize, number>

type SerializedDate = Record<typeof markers.date, string>

function isSerializedRegex(value: unknown): value is SerializedRegex {
  return isRecord(value) && typeof value[markers.regexSource] === 'string' && typeof value[markers.regexFlags] === 'string'
}

function isSerializedFunction(value: unknown): value is SerializedFunction {
  return isRecord(value) && typeof value[markers.function] === 'string'
}

function isSerializedFile(value: unknown): value is SerializedFile {
  return isRecord(value) && typeof value[markers.fileName] === 'string' && typeof value[markers.fileSize] === 'number' && typeof value[markers.fileType] === 'string'
}

function isSerializedDate(value: unknown): value is SerializedDate {
  return isRecord(value) && typeof value[markers.date] === 'string'
}

/**
 * Revive a value parsed by JSON.parse
 * @param value the value of the object
 * @param functions true to revive serialized functions, which runs their source code
 * @returns the value of the object
 */
function revive(value: unknown, functions: boolean): unknown {
  const type = detect(value)
  if (type === 'regex' && isSerializedRegex(value)) return new RegExp(value[markers.regexSource], value[markers.regexFlags])

  // reviving runs the function source, so json from a url, a storage or a server must not do it
  if (functions && type === 'function' && isSerializedFunction(value))
    // oxlint-disable-next-line no-new-func, no-implied-eval, no-unsafe-call
    return new Function(`return ${value[markers.function]}`)() // NOSONAR

  if (type === 'file' && isSerializedFile(value)) return new File([], value[markers.fileName], { type: value[markers.fileType] })

  if (type === 'date' && isSerializedDate(value)) return new Date(value[markers.date])

  return value
}

/**
 * Serializes an object to a string, using JSON.stringify with enhanced support for functions & regex
 * @param object the object to serialize to a string
 * @param options the options
 * @param options.sortKeys if true, the order of keys will be sorted alpha before serialization
 * @param options.indent if true, the output string will be indented for better readability
 * @returns the serialized object as a string
 */
export function objectSerialize(object: Readonly<Record<string, unknown>>, { indent = false, sortKeys = false }: Readonly<{ indent?: boolean; sortKeys?: boolean }> = {}) {
  return JSON.stringify(sortKeys ? objectSort(object) : object, createCircularReplacer(), indent ? nbSpacesIndent : undefined)
}

/**
 * Deserializes a string to an object, using JSON.parse with enhanced support for functions & regex
 * @param string the string to deserialize to an object
 * @param options the options
 * @param options.functions if true, serialized functions are revived by running their source code, only use it on a trusted string, default false
 * @returns the deserialized object
 */
export function objectDeserialize(string: string, { functions = false }: Readonly<{ functions?: boolean }> = {}) {
  return JSON.parse(string, (_key, value: unknown) => revive(value, functions)) as Record<number | string, unknown>
}

// note 1 : detecting Date objects in replacer function
// let's consider this object : { date: new Date() }, at first iteration _key is '', value is { date: 2021-01-01T00:00:00.000Z }
// note here that at this point, value is not an instance of Date, it's an object, but value.date is an instance of Date
// so because it's not a function, not a RegExp, we return value as is, so it's not serialized
// at second iteration, _key is 'date', value is "2021-01-01T00:00:00.000Z" but... now value is a string, not an object, so we cannot detect it's an instance of Date
// thank you JSON.stringify for this inconsistency -.-''
// but do you like magic ? this[key] is still an instance of Date, so we can use it to detect it's a Date object
// wow *mouth wide open*
