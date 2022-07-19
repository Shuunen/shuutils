import { pickOne } from './arrays'
import { flatten } from './objects'

/**
 * Clean a string from special characters
 * @param sentence like "Hello, my name is John Doe !"
 * @returns cleaned string like "Hello my name is John Doe"
 */
export const sanitize = (sentence: string): string => {
  return sentence
    .trim()
    .replace(/['’-]/g, ' ')
    .normalize('NFD')
    .replace(/[^\d\sa-z]/gi, '')
    .replace(/\s\s+/g, ' ')
    .toLowerCase()
}

/**
 * Slugify a string
 * @param string input string like `"Slug % ME with // Love !"`
 * @returns string like `"slug-me-with-love"`
 */
export function slugify (string: string): string {
  return sanitize(string) // Clean the string
    .replace(/\W+/gi, '-') // Replace all non word with dash
    .replace(/^-+/, '') // Trim dash from start
    .replace(/-+$/, '') // Trim dash from end
}

/**
 * Give a random url that point to an image
 * @returns string like `"https://server.com/image.png"`
 */
export function getRandomImageUrl (): string {
  const images = 'https://bulma.io/images/placeholders/128x128.png,https://via.placeholder.com/150,https://bulma.io/images/placeholders/64x64.png'.split(',')
  return String(pickOne(images))
}

/**
 * Give a random word or sentence without signification
 * @returns string like `"Bolowey Opnet"`
 */
export function getRandomString (): string {
  const strings = 'Bar Alto,Sin Seguritat,Lorem Ipsum,Ciao,Sit dolor,Por erestet,Tchu la Comida,Amet Inn,Aqualeris baked,Bouquet,Zu Amarillo,Ploject,Ruhe animals,Mah Plizure,Baacon pasty,Vinci mador,Alan Awake,Malohe Sutur,A priore sur,Quel memento,Kalitat arae'.split(',')
  return String(pickOne(strings))
}

/**
 * Fill mustaches in a given string
 * @param template input string, like `"Hello {{ name }} !"`
 * @param data input object, like `{ name: "world" }`
 * @returns string, like `"Hello world !"`
 */
export function fillTemplate (template: string | Record<string, unknown>, data?: Record<string, unknown>): string {
  let string = (typeof template === 'object' ? JSON.stringify(template, undefined, 2) : template)
  if (data === undefined) return string
  if (string.length === 0) return string
  const flatData = flatten(data)
  for (const [key, value] of Object.entries(flatData)) {
    const regex = new RegExp(`(/?\\*?{{?\\s*${key}\\s*}?}\\*?/?)`, 'g')
    string = string.replace(regex, String(value))
  }
  return string
}

/**
 * Transform the first letter of a string into capital
 * @param string `"hello John"`
 * @param lower boolean, try to lower the rest of the string when applicable
 * @returns `"Hello John"`
 */
export const capitalize = (string: string, lower = false): string => {
  if (!lower) return string.charAt(0).toUpperCase() + string.slice(1)
  const words = string.split(' ')
  const cap = /^[\dA-Z-]+$/
  return words.map((word, index) => {
    if (cap.test(word)) return word
    if (index === 0) return capitalize(word)
    return word.toLowerCase()
  }).join(' ')
}

/**
 * Ellipsis after a specific amount of words
 * @param stringIn `"Hello my dear friend"`
 * @param maxWords 3 for example
 * @returns `"Hello my dear..."`
 */
export const ellipsisWords = (stringIn = '', maxWords = 5): string => {
  const stringOut = stringIn.split(' ').splice(0, maxWords).join(' ')
  if (stringOut === stringIn) return stringIn
  return stringOut + '...'
}

/**
 * Ellipsis after a specific amount of characters
 * @param stringIn `"Hello my dear friend"`
 * @param maxLength 8 for example
 * @returns `"Hello my..."`
 */
export const ellipsis = (stringIn = '', maxLength = 50): string => {
  const stringOut = stringIn.slice(0, maxLength)
  if (stringOut === stringIn) return stringIn
  return stringOut + '...'
}

/**
 * Check if the given string is a JSON object
 * @param string `'{ "name": "Johnny" }'`
 * @returns the parsed object `{ name: 'Johnny' }` or `false` if the parsing failed
 */
export const isJSON = (string: string): boolean => {
  const startValid = /^(\[\s*)?{\s*"/.test(string)
  if (!startValid) return false
  try { JSON.parse(string) } catch { return false }
  return true
}

/**
 * Generate a checksum for a given string
 * @param string `"Hello my dear friend"`
 * @returns the checksum like `3547`
 */
export const stringSum = (string: string): number => [...new TextEncoder().encode(string)].reduce((a, b) => (a + b), 0)

/**
 * Check if the value is a string
 * @param value the value to check
 * @returns true if the value is a string
 */
export const isString = (value: unknown): boolean => (typeof value === 'string')

/**
 * Check if the string is a base64 string
 * @param string the string to check
 * @returns true if the string is a base64 string
 */
export const isBase64 = (string: string): boolean => /^(data:)?[\w/]+;base64,[\w+/=]+$/.test(string)

/**
 * Parse a base64 string
 * @param string the base64 string to parse
 * @returns the parsed string like `{ base64: 'iVBORw0KGgoYII=', size: 11, type: 'image/png' }`
 */
export const parseBase64 = (string: string): { base64: string, size: number, type: string } => {
  const result = { base64: '', size: 0, type: '' }
  if (!isBase64(string)) return result
  const type = string.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)
  if (type && typeof type[0] === 'string') result.type = type[0]
  const base64 = string.split('base64,')
  if (base64.length > 1 && typeof base64[1] === 'string') result.base64 = base64[1]
  result.size = Math.round(result.base64.length * 3 / 4)
  return result
}

/**
 * Parse a supposed JSON string into an object
 * @param json a string containing json like `'{ "name": "John Doe", "age": 32 }'`
 * @returns an object like `{ name: 'John Doe', age: 32 }`
 */
export const parseJson = <T> (json: string): { error: string, value: T } => {
  let error = ''
  let value = {}
  if (json !== '') try { value = JSON.parse(json) } catch (error_) { error = 'JSON invalide : ' + (error_ as Error).message }
  return { error, value: value as T }
}

/**
 * Check if the string contains HTML
 * @param string the string to check
 * @returns true if the string contains HTML
 */
export const isHtml = (string: string): boolean => /<[^>]+>/.test(string)
