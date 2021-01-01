import { pickOne } from './arrays'

const random = {
  images: 'https://bulma.io/images/placeholders/128x128.png,https://bulma.io/images/placeholders/64x64.png'.split(','),
  strings: 'Bar Alto,Sin Seguritat,Lorem Ipsum,Ciao,Sit dolor,Por erestet,Tchu la Comida,Amet Inn,Aqualeris baked,Bouquet,Zu Amarillo,Ploject,Ruhe animals,Mah Plizure,Baacon pasty,Vinci mador,Alan Awake,Malohe Sutur,A priore sur,Quel memento,Kalitat arae,Buru menhir'.split(','),
}

/**
 * Slugify a string
 * @param str input string like : "Slug % ME with // Love !"
 * @returns string like : "slug-me-with-love"
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
 * @returns string like : "https://server.com/image.png"
 */
export function getRandomImageUrl (): string {
  return pickOne(random.images)
}

/**
 * Give a random word or sentence without signification
 * @returns string like : "Bolowey Opnet"
 */
export function getRandomString (): string {
  return pickOne(random.strings)
}

/**
 * Fill mustaches in a given string
 * @param template input string, ex : "Hello {{ name }} !"
 * @param data input object, ex : { name: "world" }
 * @returns string, ex : "Hello world !"
 */
export function fillTemplate (template: string | object, data: { [key: string]: string } = {}): string {
  let string = (typeof template === 'object' ? JSON.stringify(template, undefined, 2) : template)
  if (string.length === 0) return string
  const tokens = string.match(/{{?\s?([^\s}]+)\s?}?}/g)
  if (tokens === null || tokens.length === 0) return string
  for (const token of tokens) {
    const key = token.replace(/[\s{}]/g, '')
    const value = data[key] ?? ''
    if (value.length === 0) return ''
    string = string.replace(token, value)
  }
  return string
}
