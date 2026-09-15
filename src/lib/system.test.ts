import { toUnixPath } from './system'

test('toUnixPath A empty', () => {
  expect(toUnixPath('')).toMatchInlineSnapshot(`""`)
})

test('toUnixPath B /', () => {
  expect(toUnixPath('/')).toMatchInlineSnapshot(`"/"`)
})

test('toUnixPath C /a', () => {
  expect(toUnixPath('/a')).toMatchInlineSnapshot(`"/a"`)
})

test('toUnixPath D windows style', () => {
  expect(toUnixPath(String.raw`C:\Users\Huei\AppData\Roaming`)).toMatchInlineSnapshot(`"C:/Users/Huei/AppData/Roaming"`)
})
