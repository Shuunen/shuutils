import { getPath } from './browser-routing'
import { Result } from './result'
import { fillTemplate } from './strings'

const handledLangs = ['en', 'fr'] as const

export type Lang = (typeof handledLangs)[number]

// eslint-disable-next-line prefer-named-capture-group
const langRegex = /^\/(en|fr)\//u

const defaultLang = 'en'

/**
 * Get the language from the path
 * @param path the path to get the language from, like "/en/contact"
 * @returns the language, like "en"
 */
export function getLangFromPath(path: string) {
  const detected = langRegex.exec(path)?.[1] ?? defaultLang
  return detected === 'fr' ? 'fr' : defaultLang
}

/**
 * Handle pluralization
 * @param translated the translated string, like "1 item | {count} items"
 * @param data the data to fill the template, like { count: 3 }
 * @returns the translated string, like "3 items"
 */
// eslint-disable-next-line complexity
export function handlePlural(translated: string, data?: Readonly<Record<string, unknown>>) {
  if (!translated.includes('|')) return fillTemplate(translated, data)
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const count = Number.parseInt(String(data?.count ?? '1'), 10)
  const [a = '', b = '', c = ''] = translated.split(' | ') // eslint-disable-line id-length
  if (c.length > 0 && count > 1) return fillTemplate(c, data)
  if ((c.length > 0 && count === 1) || (b.length > 0 && count > 1)) return fillTemplate(b, data)
  return fillTemplate(a, data)
}

/**
 * Translate a message
 * @param lang the language to translate to, like "en" or "fr"
 * @param message the message to translate, like "hello world" or { en: "hello {name}", fr: "bonjour {name}" }
 * @param data the data to fill the template, like { name: "world" }
 * @returns the translated message, like "hello world" or "bonjour world"
 */
export function translate(lang: Lang, message: Readonly<Record<string, string>> | string, data?: Readonly<Record<string, unknown>>) {
  const translated = typeof message === 'string' ? message : message[lang]
  if (translated === undefined) return `missing translation for message "${JSON.stringify(message)}" and lang "${lang}"`
  return handlePlural(translated, data)
}

/**
 * Translate a path
 * @param path the path to translate, like "/en/contact"
 * @param targetLang the target language to translate to, like "fr"
 * @returns the translated path, like "/fr/contact"
 */
export function localePath(path: string, targetLang: Lang = defaultLang) {
  if (!handledLangs.includes(targetLang)) return Result.error(`unsupported lang "${targetLang}", cannot translate path "${path}"`)
  return Result.ok(getPath(path, targetLang === defaultLang ? '' : targetLang))
}

/**
 * Get a translator
 * @param lang the language to translate to, like "en" or "fr"
 * @returns the translator function
 * @example const $t = getTranslator('en')
 */
export function getTranslator(lang: Lang) {
  return (message: Readonly<Record<string, string>> | string, data?: Readonly<Record<string, unknown>>) => translate(lang, message, data)
}
