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
export function slugify (str: string): string {
  // does not handle accentuated
  // ex : Déjà Vu => d-j-vu
  return str.toLowerCase().trim() // Lower case everything & trim
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
