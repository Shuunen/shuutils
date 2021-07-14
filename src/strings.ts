import { pickOne } from './arrays'
import { flatten } from './objects'

const random = {
  images: 'https://bulma.io/images/placeholders/128x128.png,https://bulma.io/images/placeholders/64x64.png'.split(','),
  strings: 'Bar Alto,Sin Seguritat,Lorem Ipsum,Ciao,Sit dolor,Por erestet,Tchu la Comida,Amet Inn,Aqualeris baked,Bouquet,Zu Amarillo,Ploject,Ruhe animals,Mah Plizure,Baacon pasty,Vinci mador,Alan Awake,Malohe Sutur,A priore sur,Quel memento,Kalitat arae,Buru menhir'.split(','),
}

/**
 * Slugify a string
 * @param str input string like `"Slug % ME with // Love !"`
 * @returns string like `"slug-me-with-love"`
 */
export function slugify (string: string): string {
  // does not handle accentuated
  // ex : Déjà Vu => d-j-vu
  return string.toLowerCase().trim() // Lower case everything & trim
    .replace(/\W+/gi, '-') // Replace all non word with dash
    .replace(/^-+/, '') // Trim dash from start
    .replace(/-+$/, '') // Trim dash from end
}

/**
 * Give a random url that point to an image
 * @returns string like `"https://server.com/image.png"`
 */
export function getRandomImageUrl (): string {
  return pickOne(random.images)
}

/**
 * Give a random word or sentence without signification
 * @returns string like `"Bolowey Opnet"`
 */
export function getRandomString (): string {
  return pickOne(random.strings)
}

/**
 * Fill mustaches in a given string
 * @param template input string, like `"Hello {{ name }} !"`
 * @param data input object, like `{ name: "world" }`
 * @returns string, like `"Hello world !"`
 */
export function fillTemplate (template: string | Record<string, unknown>, data = {} as Record<string, unknown>): string {
  let string = (typeof template === 'object' ? JSON.stringify(template, undefined, 2) : template)
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
 * @param str `"hello John"`
 * @returns `"Hello John"`
 */
export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Ellipsis after a specific amount of words
 * @param stringIn `"Hello my dear friend"`
 * @param maxWords 3 for example
 * @returns `"Hello my dear..."`
 */
export const ellipsisWords = (stringIn: string, maxWords = 5): string => {
  const stringOut = stringIn.split(' ').splice(0, maxWords).join(' ')
  if (stringOut === stringIn) return stringIn
  return stringOut + '...'
}

export const ellipsis = (stringIn: string, maxLength = 50): string => {
  const stringOut = stringIn.slice(0, maxLength)
  if (stringOut === stringIn) return stringIn
  return stringOut + '...'
}

/**
 * Check if the given string is a JSON object
 * @param str `'{ "name": "Johnny" }'`
 * @returns the parsed object `{ name: 'Johnny' }` or `false` if the parsing failed
 */
export const isJSON = (str: string): Record<string, unknown> | boolean => {
  const startValid = /^(\[\s*)?{\s*"/.test(str)
  if (!startValid) return false
  let data: Record<string, unknown>
  try { data = JSON.parse(str) } catch { return false }
  return data
}
