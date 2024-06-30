import { expect, it } from 'vitest'
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
  hexToHsl,
  hexToRgb,
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
} from '../src'

it('is not Firefox', () => {
  expect(isFirefox()).toBe(false)
})

it('add color code', () => {
  expect(addColorCode(22, 32, 'test')).toMatchSnapshot()
})

it('color reset', () => {
  expect(reset('test')).toMatchSnapshot()
})
it('color bold', () => {
  expect(bold('test')).toMatchSnapshot()
})
it('color dim', () => {
  expect(dim('test')).toMatchSnapshot()
})
it('color italic', () => {
  expect(italic('test')).toMatchSnapshot()
})
it('color underline', () => {
  expect(underline('test')).toMatchSnapshot()
})
it('color overline', () => {
  expect(overline('test')).toMatchSnapshot()
})
it('color inverse', () => {
  expect(inverse('test')).toMatchSnapshot()
})
it('color strikeThrough', () => {
  expect(strikeThrough('test')).toMatchSnapshot()
})
it('color black', () => {
  expect(black('test')).toMatchSnapshot()
})
it('color red', () => {
  expect(red('test')).toMatchSnapshot()
})
it('color green', () => {
  expect(green('test')).toMatchSnapshot()
})
it('color yellow', () => {
  expect(yellow('test')).toMatchSnapshot()
})
it('color blue', () => {
  expect(blue('test')).toMatchSnapshot()
})
it('color magenta', () => {
  expect(magenta('test')).toMatchSnapshot()
})
it('color cyan', () => {
  expect(cyan('test')).toMatchSnapshot()
})
it('color white', () => {
  expect(white('test')).toMatchSnapshot()
})
it('color gray', () => {
  expect(gray('test')).toMatchSnapshot()
})
it('color bgBlack', () => {
  expect(bgBlack('test')).toMatchSnapshot()
})
it('color bgRed', () => {
  expect(bgRed('test')).toMatchSnapshot()
})
it('color bgGreen', () => {
  expect(bgGreen('test')).toMatchSnapshot()
})
it('color bgYellow', () => {
  expect(bgYellow('test')).toMatchSnapshot()
})
it('color bgBlue', () => {
  expect(bgBlue('test')).toMatchSnapshot()
})
it('color bgMagenta', () => {
  expect(bgMagenta('test')).toMatchSnapshot()
})
it('color bgCyan', () => {
  expect(bgCyan('test')).toMatchSnapshot()
})
it('color bgWhite', () => {
  expect(bgWhite('test')).toMatchSnapshot()
})
it('color bgGray', () => {
  expect(bgGray('test')).toMatchSnapshot()
})

it('color hexToRgb A', () => {
  expect(hexToRgb('#f00')).toStrictEqual({ colorBlue: 0, colorGreen: 0, colorRed: 255 })
})
it('color hexToRgb B', () => {
  expect(hexToRgb('#0f0')).toStrictEqual({ colorBlue: 0, colorGreen: 255, colorRed: 0 })
})
it('color hexToRgb C', () => {
  expect(hexToRgb('#00f')).toStrictEqual({ colorBlue: 255, colorGreen: 0, colorRed: 0 })
})
it('color hexToRgb D', () => {
  expect(hexToRgb('#ff0000')).toStrictEqual({ colorBlue: 0, colorGreen: 0, colorRed: 255 })
})
it('color hexToRgb E', () => {
  expect(() => hexToRgb('#00')).toThrowError(/invalid/iu)
})

it('color hexToHsl A red short', () => {
  expect(hexToHsl('#f00')).toStrictEqual({ hue: 0, lightness: 50, saturation: 100 })
})
it('color hexToHsl B red long', () => {
  expect(hexToHsl('#ff0000')).toStrictEqual({ hue: 0, lightness: 50, saturation: 100 })
})
it('color hexToHsl C', () => {
  expect(hexToHsl('#663399')).toStrictEqual({ hue: 270, lightness: 40, saturation: 50 })
})
it('color hexToHsl D', () => {
  expect(hexToHsl('#000000')).toStrictEqual({ hue: 0, lightness: 0, saturation: 0 })
})
it('color hexToHsl E', () => {
  expect(hexToHsl('#ffffff')).toStrictEqual({ hue: 0, lightness: 100, saturation: 0 })
})
it('color hexToHsl F green short', () => {
  expect(hexToHsl('#0f0')).toStrictEqual({ hue: 120, lightness: 50, saturation: 100 })
})
it('color hexToHsl G green long', () => {
  expect(hexToHsl('#00ff00')).toStrictEqual({ hue: 120, lightness: 50, saturation: 100 })
})
it('color hexToHsl H blue short', () => {
  expect(hexToHsl('#00f')).toStrictEqual({ hue: 240, lightness: 50, saturation: 100 })
})
