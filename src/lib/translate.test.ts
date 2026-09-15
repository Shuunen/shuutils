import { Result } from './result'
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

test('localePath A', () => {
  const result = Result.unwrap(localePath(''))
  expect(result.value).toMatchInlineSnapshot(`""`)
  expect(result.error).toBeUndefined()
})

test('localePath B', () => {
  const result = Result.unwrap(localePath('/'))
  expect(result.value).toMatchInlineSnapshot(`"/"`)
  expect(result.error).toBeUndefined()
})

test('localePath C', () => {
  const result = Result.unwrap(localePath('/contact', 'en'))
  expect(result.value).toMatchInlineSnapshot(`"/contact"`)
  expect(result.error).toBeUndefined()
})

test('localePath D', () => {
  const result = Result.unwrap(localePath('/en/contact', 'en'))
  expect(result.value).toMatchInlineSnapshot(`"/contact"`)
  expect(result.error).toBeUndefined()
})

test('localePath E', () => {
  const result = Result.unwrap(localePath('/fr/contact', 'en'))
  expect(result.value).toMatchInlineSnapshot(`"/contact"`)
  expect(result.error).toBeUndefined()
})

test('localePath F', () => {
  const result = Result.unwrap(localePath('/contact', 'fr'))
  expect(result.value).toMatchInlineSnapshot(`"/fr/contact"`)
  expect(result.error).toBeUndefined()
})

test('localePath G', () => {
  // @ts-expect-error testing invalid lang
  const result = Result.unwrap(localePath('/contact', 'hz'))
  expect(result.value).toBeUndefined()
  expect(result.error).toMatchInlineSnapshot(`"unsupported lang "hz", cannot translate path "/contact""`)
})

const $t = getTranslator('en')

test('$t A root non-existing translation key', () => {
  expect($t('hello')).toMatchInlineSnapshot('"hello"')
})

test('$t B nested non-existing translation key', () => {
  expect($t('general.switch-lang')).toMatchInlineSnapshot('"general.switch-lang"')
})

test('$t C nested non-existing translation key with data', () => {
  expect($t('general.switch-lang', { lang: 'en' })).toMatchInlineSnapshot('"general.switch-lang"')
})

test('$t D root existing translation key', () => {
  expect($t(messages.actions.login)).toMatchInlineSnapshot(`"Log in"`)
})

test('$t E root existing translation key with data', () => {
  expect($t(messages.notifications.itemAddedOn, { time: 'jour de la baguette' })).toMatchInlineSnapshot(`"Item added on jour de la baguette"`)
})

test('$t F singular / plural : singular', () => {
  expect($t(messages.validation.maxChar, { count: 1, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir un seul caractère"`)
})

test('$t G singular / plural : plural', () => {
  expect($t(messages.validation.maxChar, { count: 12, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir 12 caractères maximum"`)
})

test('$t H none / singular / plural : none', () => {
  expect($t(messages.validation.minChar, { count: 0, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir au moins un caractère"`)
})

test('$t I none / singular / plural : singular', () => {
  expect($t(messages.validation.minChar, { count: 1, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir plus d'un caractère"`)
})

test('$t J none / singular / plural : plural', () => {
  expect($t(messages.validation.minChar, { count: 12, fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir au moins 12 caractères"`)
})

test('$t K missing data for pluralization', () => {
  expect($t(messages.validation.minChar)).toMatchInlineSnapshot(`"Le champ doit contenir plus d'un caractère"`)
})

test('$t L missing count in data for pluralization', () => {
  expect($t(messages.validation.minChar, { fieldName: 'name' })).toMatchInlineSnapshot(`"Le champ doit contenir plus d'un caractère"`)
})

test('$t M missing current language', () => {
  expect($t({ es: 'Muy bien' })).toMatchInlineSnapshot(`"missing translation for message "{"es":"Muy bien"}" and lang "en""`)
})

test('getLangFromPath A', () => {
  expect(getLangFromPath('')).toMatchInlineSnapshot('"en"')
})

test('getLangFromPath B', () => {
  expect(getLangFromPath('/')).toMatchInlineSnapshot('"en"')
})

test('getLangFromPath C', () => {
  expect(getLangFromPath('/contact')).toMatchInlineSnapshot('"en"')
})

test('getLangFromPath D', () => {
  expect(getLangFromPath('/en/contact')).toMatchInlineSnapshot('"en"')
})

test('getLangFromPath E', () => {
  expect(getLangFromPath('/fr/contact')).toMatchInlineSnapshot('"fr"')
})
