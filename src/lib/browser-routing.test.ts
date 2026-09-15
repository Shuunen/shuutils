import { getPage, getPath } from './browser-routing'
import { isBrowserEnvironment } from './environment'

test('isBrowserEnvironment A', () => {
  expect(isBrowserEnvironment()).toBe(false)
})

test('getPage A', () => {
  expect(getPage('')).toMatchInlineSnapshot('"index"')
})

test('getPage B', () => {
  expect(getPage('//contact')).toMatchInlineSnapshot('"contact"')
})

test('getPage C', () => {
  expect(getPage('/en/contact')).toMatchInlineSnapshot('"contact"')
})

test('getPage D', () => {
  expect(getPage('/fr/contact/top')).toMatchInlineSnapshot('"contact/top"')
})

test('getPage E', () => {
  expect(getPage('/fr/contact/top.html')).toMatchInlineSnapshot('"contact/top"')
})

test('getPath A', () => {
  expect(getPath('')).toMatchInlineSnapshot(`""`)
})

test('getPath B', () => {
  expect(getPath('/')).toMatchInlineSnapshot('"/"')
})

test('getPath C', () => {
  expect(getPath('/contact', 'en')).toMatchInlineSnapshot('"/en/contact"')
})

test('getPath D', () => {
  expect(getPath('/en/contact', 'en')).toMatchInlineSnapshot('"/en/contact"')
})

test('getPath E', () => {
  expect(getPath('/fr/contact', 'en')).toMatchInlineSnapshot('"/en/contact"')
})

test('getPath F', () => {
  expect(getPath('//contact', 'fr')).toMatchInlineSnapshot('"/fr/contact"')
})

test('getPath G', () => {
  expect(getPath('//us///super/contact', 'us')).toMatchInlineSnapshot('"/us/super/contact"')
})

test('getPath H should handle url === "" and isBrowserEnvironment() === false', () => {
  // url is '', isBrowserEnvironment returns false
  const originalIsBrowserEnvironment = isBrowserEnvironment
  // @ts-expect-error override for test
  globalThis.isBrowserEnvironment = () => false
  expect(getPath('')).toBe('')
  // @ts-expect-error restore
  globalThis.isBrowserEnvironment = originalIsBrowserEnvironment
})

test('getPath I should handle path === "blank"', () => {
  // Simulate browser environment
  const originalIsBrowserEnvironment = isBrowserEnvironment,
    originalDocument = globalThis.document,
    originalMatchMedia = globalThis.matchMedia
  // @ts-expect-error override for test
  globalThis.matchMedia = () => true
  // @ts-expect-error override for test
  globalThis.document = { location: { pathname: 'blank' } }
  // @ts-expect-error override for test
  globalThis.isBrowserEnvironment = () => true
  expect(getPath()).toBe('')
  // Restore
  if (originalDocument) globalThis.document = originalDocument

  if (originalMatchMedia) globalThis.matchMedia = originalMatchMedia

  // @ts-expect-error restore
  globalThis.isBrowserEnvironment = originalIsBrowserEnvironment
})

test('getPath J should remove lang from path', () => {
  expect(getPath('/fr/contact')).toBe('/contact')
})

test('getPath K should add lang to path', () => {
  expect(getPath('/contact', 'fr')).toBe('/fr/contact')
})

test('getPage L should handle path with only dots', () => {
  // This tests the edge case where split('.')[0] could be undefined
  // getPage('.') returns 'index' because getPath('.') returns '' which is the index page
  expect(getPage('.')).toBe('index')
})
