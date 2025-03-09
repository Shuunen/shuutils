import { expect, it } from 'bun:test'
import { hexToHsl, hexToRgb } from './color-converters'

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
