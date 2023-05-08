/* c8 ignore next */
import { pickOne } from './array-pick-one'
import { nbSpacesIndent } from './constants'
import { flatten } from './object-flatten'

/**
 * Clean a string from special characters
 * @param sentence like "Hello, my name is John Doe !"
 * @returns cleaned string like "Hello my name is John Doe"
 */
export function sanitize (sentence: string) {
  return sentence
    .trim()
    .replace(/['’-]/gu, ' ')
    .normalize('NFD')
    .replace(/[^\d\sa-z]/giu, '')
    .replace(/\s{2,}/gu, ' ')
    .toLowerCase()
}

/**
 * Slugify a string
 * @param string input string like `"Slug % ME with // Love !"`
 * @returns string like `"slug-me-with-love"`
 */
export function slugify (string: string) {
  return sanitize(string) // Clean the string
    .replace(/\W+/giu, '-') // Replace all non word with dash
    .replace(/^-+/u, '') // Trim dash from start
    // eslint-disable-next-line regexp/no-super-linear-move
    .replace(/-+$/u, '') // Trim dash from end
}

/**
 * Give a random url that point to an image
 * @returns string like `"https://server.com/image.png"`
 */
export function getRandomImageUrl () {
  const images = 'https://bulma.io/images/placeholders/128x128.png,https://via.placeholder.com/150,https://bulma.io/images/placeholders/64x64.png'.split(',')
  return String(pickOne(images))
}

/**
 * Give a random word or sentence without signification
 * @returns string like `"Bolowey Opnet"`
 */
export function getRandomString () {
  const strings = 'Bar Alto,Sin Seguritat,Lorem Ipsum,Ciao,Sit dolor,Por erestet,Tchu la Comida,Amet Inn,Aqualeris baked,Bouquet,Zu Amarillo,Ploject,Ruhe animals,Mah Plizure,Baacon pasty,Vinci mador,Alan Awake,Malohe Sutur,A priore sur,Quel memento,Kalitat arae'.split(',')
  return String(pickOne(strings))
}

/**
 * Fill mustaches in a given string
 * @param template input string, like `"Hello {{ name }} !"`
 * @param data input object, like `{ name: "world" }`
 * @returns string, like `"Hello world !"`
 */
export function fillTemplate (template: Record<string, unknown> | string, data?: Record<string, unknown>) {
  let string = (typeof template === 'object' ? JSON.stringify(template, undefined, nbSpacesIndent) : template)
  if (data === undefined) return string
  if (string.length === 0) return string
  const flatData = flatten(data)
  for (const [key, value] of Object.entries(flatData)) {
    // eslint-disable-next-line require-unicode-regexp, security/detect-non-literal-regexp
    const regex = new RegExp(`(/?\\*?{{?\\s*${key}\\s*}?}\\*?/?)`, 'g')
    string = string.replace(regex, String(value))
  }
  return string
}

/**
 * Transform the first letter of a string into capital
 * @param string `"hello John"`
 * @param shouldLower boolean, try to lower the rest of the string when applicable
 * @returns `"Hello John"`
 */
export function capitalize (string: string, shouldLower = false) {
  if (!shouldLower) return string.charAt(0).toUpperCase() + string.slice(1)
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

/**
 * Ellipsis after a specific amount of words
 * @param stringIn `"Hello my dear friend"`
 * @param maxWords 3 for example
 * @returns `"Hello my dear..."`
 */
export function ellipsisWords (stringIn = '', maxWords = 5) {
  const stringOut = stringIn.split(' ').splice(0, maxWords).join(' ')
  if (stringOut === stringIn) return stringIn
  return `${stringOut}...`
}

/**
 * Ellipsis after a specific amount of characters
 * @param stringIn `"Hello my dear friend"`
 * @param maxLength 8 for example
 * @returns `"Hello my..."`
 */
export function ellipsis (stringIn = '', maxLength = 50) {
  const stringOut = stringIn.slice(0, maxLength)
  if (stringOut === stringIn) return stringIn
  return `${stringOut}...`
}

/**
 * Check if the given string is a JSON object
 * @param string `'{ "name": "Johnny" }'`
 * @returns the parsed object `{ name: 'Johnny' }` or `false` if the parsing failed
 */
export function isJson (string: string) {
  // eslint-disable-next-line security/detect-unsafe-regex, unicorn/no-unsafe-regex
  const hasValidStart = /^(?:\[\s*)?\{\s*"/u.test(string)
  if (!hasValidStart) return false
  try { JSON.parse(string) } catch { return false }
  return true
}

/**
 * Create a CRC32 table
 * @returns a table of 256 numbers
 */
export function createCrc32Table () {
  const table: number[] = Array.from({ length: 256 })
  for (let index = 0; index < 256; index += 1) { // eslint-disable-line @typescript-eslint/no-magic-numbers
    let code = index
    for (let indexB = 0; indexB < 8; indexB += 1) code = code & 0x01 ? 3_988_292_384 ^ (code >>> 1) : code >>> 1 // eslint-disable-line no-bitwise, @typescript-eslint/no-magic-numbers
    table[index] = code
  }
  return table
}

/**
 * Generate a CRC32 checksum for a given string
 * https://dirask.com/posts/TypeScript-calculate-crc32-p2ZBKp
 * @param text the string to checksum
 * @returns the checksum like `3547`
 */
export function crc32 (text: string) {
  const crcTable = createCrc32Table()
  let crc = -1 // eslint-disable-line @typescript-eslint/no-magic-numbers
  for (let index = 0; index < text.length; index += 1) {
    /* c8 ignore next */
    const code = text.codePointAt(index) ?? 0
    const key: number = (code ^ crc) & 0xFF // eslint-disable-line @typescript-eslint/no-magic-numbers, no-bitwise
    const value: number | undefined = crcTable[key]
    if (value !== undefined && value !== 0) crc = value ^ (crc >>> 8) // eslint-disable-line no-bitwise, @typescript-eslint/no-magic-numbers
  }
  return (-1 ^ crc) >>> 0 // eslint-disable-line no-bitwise, @typescript-eslint/no-magic-numbers
}

/**
 * Generate a checksum for a given string
 * @param string `"Hello my dear friend"`
 * @returns the checksum like `3547`
 */
export function stringSum (string: string) {
  return crc32(string)
}

/**
 * Check if the value is a string
 * @param value the value to check
 * @returns true if the value is a string
 */
export function isString (value: unknown) {
  return (typeof value === 'string')
}

/**
 * Check if the string is a base64 string
 * @param string the string to check
 * @returns true if the string is a base64 string
 */
export function isBase64 (string: string) {
  return /^(?:data:)?[\w/]+;base64,[\w+/=]+$/u.test(string)
}

/**
 * Parse a base64 string
 * @param string the base64 string to parse
 * @returns the parsed string like `{ base64: 'iVBORw0KGgoYII=', size: 11, type: 'image/png' }`
 */
export function parseBase64 (string: string) {
  const result = { base64: '', size: 0, type: '' }
  if (!isBase64(string)) return result
  // eslint-disable-next-line regexp/no-super-linear-move
  const type = /[^:]\w+\/[\w+.-]+(?=;|,)/u.exec(string)
  if (type && typeof type[0] === 'string') [result.type] = type
  const base64 = string.split('base64,')
  if (base64.length > 1 && typeof base64[1] === 'string') [, result.base64] = base64
  result.size = Math.round(result.base64.length * 3 / 4) // eslint-disable-line @typescript-eslint/no-magic-numbers
  return result
}

/**
 * Parse a supposed JSON string into an object
 * @param json a string containing json like `'{ "name": "John Doe", "age": 32 }'`
 * @returns an object like `{ name: 'John Doe', age: 32 }`
 */
// eslint-disable-next-line etc/no-misused-generics
export function parseJson<T> (json: string) {
  let error = ''
  let value = {}
  if (json !== '') try {
    value = JSON.parse(json) // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  } catch (error_) { error = `JSON invalide : ${(error_ as Error).message}` } // eslint-disable-line @typescript-eslint/consistent-type-assertions
  return { error, value: value as T } // eslint-disable-line @typescript-eslint/consistent-type-assertions
}

/**
 * Check if the string contains HTML
 * @param string the string to check
 * @returns true if the string contains HTML
 */
export function isHtml (string: string) {
  // eslint-disable-next-line regexp/no-super-linear-move
  return /<[^>]+>/u.test(string)
}

/**
 * Inject a mark in a string at a specific placeholder locations like
 * `__placeholder__` or `<div id="placeholder">...</div>` or `<meta name="placeholder" content="..." />`
 * @param content the string to inject the mark in
 * @param placeholder the placeholder to replace
 * @param mark the mark to inject
 * @returns the new string with the mark injected
 */
export function injectMark (content: string, placeholder: string, mark: string) {
  /* eslint-disable security/detect-non-literal-regexp */
  return content
    .replace(new RegExp(`__${placeholder}__`, 'gu'), mark)
    // eslint-disable-next-line require-unicode-regexp
    .replace(new RegExp(`{{1,2}${placeholder}}{1,2}`, 'g'), mark)
    .replace(new RegExp(`(<[a-z]+ .*id="${placeholder}"[^>]*>)[^<]*(</[a-z]+>)`, 'u'), `$1${mark}$2`)
    .replace(new RegExp(`(<meta name="${placeholder}" content=")[^"]*(")`, 'u'), `$1${mark}$2`)
  /* eslint-enable security/detect-non-literal-regexp */
}

