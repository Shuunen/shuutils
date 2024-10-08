import { expect, it } from 'vitest'
import { getLangFromPath, getTranslator, localePath } from './translate'

const messages = {
  actions: {
    login: {
      en: 'Log in',
      fr: 'Se connecter',
    },
  },
  notifications: {
    itemAddedOn: {
      en: 'Item added on {time}',
      fr: 'Objet ajouté le {time}',
    },
  },
  validation: {
    maxChar: 'Le champ doit contenir un seul caractère | Le champ doit contenir {count} caractères maximum',
    minChar: "Le champ doit contenir au moins un caractère | Le champ doit contenir plus d'un caractère | Le champ doit contenir au moins {count} caractères",
  },
}

it('localePath A', () => {
  expect(localePath('')).toMatchInlineSnapshot(`""`)
})
it('localePath B', () => {
  expect(localePath('/')).toMatchInlineSnapshot('"/"')
})
it('localePath C', () => {
  expect(localePath('/contact', 'en')).toMatchInlineSnapshot(`"/contact"`)
})
it('localePath D', () => {
  expect(localePath('/en/contact', 'en')).toMatchInlineSnapshot(`"/contact"`)
})
it('localePath E', () => {
  expect(localePath('/fr/contact', 'en')).toMatchInlineSnapshot(`"/contact"`)
})
it('localePath F', () => {
  expect(localePath('/contact', 'fr')).toMatchInlineSnapshot(`"/fr/contact"`)
})
it('localePath G', () => {
  // @ts-expect-error testing invalid lang
  expect(() => localePath('/contact', 'hz')).toThrowErrorMatchingInlineSnapshot(`[Error: unsupported lang "hz", cannot translate path "/contact"]`)
})

const $t = getTranslator('en')

it('$t A root non-existing translation key', () => {
  expect($t('hello')).toMatchInlineSnapshot('"hello"')
})
it('$t B nested non-existing translation key', () => {
  expect($t('general.switch-lang')).toMatchInlineSnapshot('"general.switch-lang"')
})
it('$t C nested non-existing translation key with data', () => {
  expect($t('general.switch-lang', { lang: 'en' })).toMatchInlineSnapshot('"general.switch-lang"')
})
it('$t D root existing translation key', () => {
  expect($t(messages.actions.login)).toMatchInlineSnapshot(`"Log in"`)
})
it('$t E root existing translation key with data', () => {
  expect($t(messages.notifications.itemAddedOn, { time: 'jour de la baguette' })).toMatchInlineSnapshot(`"Item added on jour de la baguette"`)
})
it('$t F singular / plural : singular', () => {
  expect($t(messages.validation.maxChar, { count: 1, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir un seul caractère"`)
})
it('$t G singular / plural : plural', () => {
  expect($t(messages.validation.maxChar, { count: 12, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir 12 caractères maximum"`)
})
it('$t H none / singular / plural : none', () => {
  expect($t(messages.validation.minChar, { count: 0, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir au moins un caractère"`)
})
it('$t I none / singular / plural : singular', () => {
  expect($t(messages.validation.minChar, { count: 1, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir plus d'un caractère"`)
})
it('$t J none / singular / plural : plural', () => {
  expect($t(messages.validation.minChar, { count: 12, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir au moins 12 caractères"`)
})
it('$t K missing data for pluralization', () => {
  expect($t(messages.validation.minChar)).toMatchInlineSnapshot(`"Le champ doit contenir plus d'un caractère"`)
})
it('$t L missing count in data for pluralization', () => {
  expect($t(messages.validation.minChar, { fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir plus d'un caractère"`)
})
it('$t M missing current language', () => {
  expect($t({ es: 'Muy bien' })).toMatchInlineSnapshot(`"missing translation for message "{"es":"Muy bien"}" and lang "en""`)
})

it('getLangFromPath A', () => {
  expect(getLangFromPath('')).toMatchInlineSnapshot('"en"')
})
it('getLangFromPath B', () => {
  expect(getLangFromPath('/')).toMatchInlineSnapshot('"en"')
})
it('getLangFromPath C', () => {
  expect(getLangFromPath('/contact')).toMatchInlineSnapshot('"en"')
})
it('getLangFromPath D', () => {
  expect(getLangFromPath('/en/contact')).toMatchInlineSnapshot('"en"')
})
it('getLangFromPath E', () => {
  expect(getLangFromPath('/fr/contact')).toMatchInlineSnapshot('"fr"')
})
