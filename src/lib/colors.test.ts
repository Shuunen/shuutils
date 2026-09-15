import {
  addColorCode,
  bgBlack,
  bgBlue,
  bgCyan,
  bgGray,
  bgGreen,
  bgMagenta,
  bgRed,
  bgWhite,
  bgYellow,
  black,
  blue,
  bold,
  cyan,
  dim,
  gray,
  green,
  inverse,
  isFirefox,
  italic,
  magenta,
  overline,
  red,
  reset,
  strikeThrough,
  underline,
  white,
  yellow,
} from './colors'

test('is not Firefox', () => {
  expect(isFirefox()).toBe(false)
})

test('add color code', () => {
  expect(addColorCode(22, 32, 'test')).toMatchSnapshot()
})

test('color reset', () => {
  expect(reset('test')).toMatchSnapshot()
})

test('color bold', () => {
  expect(bold('test')).toMatchSnapshot()
})

test('color dim', () => {
  expect(dim('test')).toMatchSnapshot()
})

test('color italic', () => {
  expect(italic('test')).toMatchSnapshot()
})

test('color underline', () => {
  expect(underline('test')).toMatchSnapshot()
})

test('color overline', () => {
  expect(overline('test')).toMatchSnapshot()
})

test('color inverse', () => {
  expect(inverse('test')).toMatchSnapshot()
})

test('color strikeThrough', () => {
  expect(strikeThrough('test')).toMatchSnapshot()
})

test('color black', () => {
  expect(black('test')).toMatchSnapshot()
})

test('color red', () => {
  expect(red('test')).toMatchSnapshot()
})

test('color green', () => {
  expect(green('test')).toMatchSnapshot()
})

test('color yellow', () => {
  expect(yellow('test')).toMatchSnapshot()
})

test('color blue', () => {
  expect(blue('test')).toMatchSnapshot()
})

test('color magenta', () => {
  expect(magenta('test')).toMatchSnapshot()
})

test('color cyan', () => {
  expect(cyan('test')).toMatchSnapshot()
})

test('color white', () => {
  expect(white('test')).toMatchSnapshot()
})

test('color gray', () => {
  expect(gray('test')).toMatchSnapshot()
})

test('color bgBlack', () => {
  expect(bgBlack('test')).toMatchSnapshot()
})

test('color bgRed', () => {
  expect(bgRed('test')).toMatchSnapshot()
})

test('color bgGreen', () => {
  expect(bgGreen('test')).toMatchSnapshot()
})

test('color bgYellow', () => {
  expect(bgYellow('test')).toMatchSnapshot()
})

test('color bgBlue', () => {
  expect(bgBlue('test')).toMatchSnapshot()
})

test('color bgMagenta', () => {
  expect(bgMagenta('test')).toMatchSnapshot()
})

test('color bgCyan', () => {
  expect(bgCyan('test')).toMatchSnapshot()
})

test('color bgWhite', () => {
  expect(bgWhite('test')).toMatchSnapshot()
})

test('color bgGray', () => {
  expect(bgGray('test')).toMatchSnapshot()
})
