// Credits to : https://github.com/sindresorhus/yoctocolors/blob/main/index.js

import { Nb } from './constants'

/**
 * Reset the string color to the default terminal color
 * @param string the string to reset
 * @returns {string} the string with the reset color
 */
export function reset (string: string): string {
  return `\u001B[0m${string}\u001B[0m`
}

/**
 * Render a bold string for the terminal
 * @param string the string to render
 * @returns {string} the string with the bold decoration
 */
export function bold (string: string): string {
  return `\u001B[1m${string}\u001B[22m`
}

/**
 * Render a dim string for the terminal
 * @param string the string to render
 * @returns {string} the string with the dim decoration
 */
export function dim (string: string): string {
  return `\u001B[2m${string}\u001B[22m`
}

/**
 * Render a italic string for the terminal
 * @param string the string to render
 * @returns {string} the string with the italic decoration
 */
export function italic (string: string): string {
  return `\u001B[3m${string}\u001B[23m`
}

/**
 * Render a underline string for the terminal
 * @param string the string to render
 * @returns {string} the string with the underline decoration
 */
export function underline (string: string): string {
  return `\u001B[4m${string}\u001B[24m`
}

/**
 * Render a overline string for the terminal
 * @param string the string to render
 * @returns {string} the string with the overline decoration
 */
export function overline (string: string): string {
  return `\u001B[53m${string}\u001B[55m`
}

/**
 * Render an inverse string for the terminal
 * @param string the string to render
 * @returns {string} the string with the inverse decoration
 */
export function inverse (string: string): string {
  return `\u001B[7m${string}\u001B[27m`
}

/**
 * Render a strike-through string for the terminal
 * @param string the string to render
 * @returns {string} the string with the strike-through decoration
 */
export function strikeThrough (string: string): string {
  return `\u001B[9m${string}\u001B[29m`
}

/**
 * Render a black string for the terminal
 * @param string the string to render
 * @returns {string} the string with the black color
 */
export function black (string: string): string {
  return `\u001B[30m${string}\u001B[39m`
}

/**
 * Render a red string for the terminal
 * @param string the string to render
 * @returns {string} the string with the red color
 */
export function red (string: string): string {
  return `\u001B[31m${string}\u001B[39m`
}

/**
 * Render a green string for the terminal
 * @param string the string to render
 * @returns {string} the string with the green color
 */
export function green (string: string): string {
  return `\u001B[32m${string}\u001B[39m`
}

/**
 * Render a yellow string for the terminal
 * @param string the string to render
 * @returns {string} the string with the yellow color
 */
export function yellow (string: string): string {
  return `\u001B[33m${string}\u001B[39m`
}

/**
 * Render a blue string for the terminal
 * @param string the string to render
 * @returns {string} the string with the blue color
 */
export function blue (string: string): string {
  return `\u001B[34m${string}\u001B[39m`
}

/**
 * Render a magenta string for the terminal
 * @param string the string to render
 * @returns {string} the string with the magenta color
 */
export function magenta (string: string): string {
  return `\u001B[35m${string}\u001B[39m`
}

/**
 * Render a cyan string for the terminal
 * @param string the string to render
 * @returns {string} the string with the cyan color
 */
export function cyan (string: string): string {
  return `\u001B[36m${string}\u001B[39m`
}

/**
 * Render a white string for the terminal
 * @param string the string to render
 * @returns {string} the string with the white color
 */
export function white (string: string): string {
  return `\u001B[37m${string}\u001B[39m`
}

/**
 * Render a gray string for the terminal
 * @param string the string to render
 * @returns {string} the string with the gray color
 */
export function gray (string: string): string {
  return `\u001B[90m${string}\u001B[39m`
}


/**
 * Render a string on a black background for the terminal
 * @param string the string to render
 * @returns {string} the string with the black background
 */
export function bgBlack (string: string): string {
  return `\u001B[40m${string}\u001B[49m`
}

/**
 * Render a string on a red background for the terminal
 * @param string the string to render
 * @returns {string} the string with the red background
 */
export function bgRed (string: string): string {
  return `\u001B[41m${string}\u001B[49m`
}

/**
 * Render a string on a green background for the terminal
 * @param string the string to render
 * @returns {string} the string with the green background
 */
export function bgGreen (string: string): string {
  return `\u001B[42m${string}\u001B[49m`
}

/**
 * Render a string on a yellow background for the terminal
 * @param string the string to render
 * @returns {string} the string with the yellow background
 */
export function bgYellow (string: string): string {
  return `\u001B[43m${string}\u001B[49m`
}

/**
 * Render a string on a blue background for the terminal
 * @param string the string to render
 * @returns {string} the string with the blue background
 */
export function bgBlue (string: string): string {
  return `\u001B[44m${string}\u001B[49m`
}

/**
 * Render a string on a magenta background for the terminal
 * @param string the string to render
 * @returns {string} the string with the magenta background
 */
export function bgMagenta (string: string): string {
  return `\u001B[45m${string}\u001B[49m`
}

/**
 * Render a string on a cyan background for the terminal
 * @param string the string to render
 * @returns {string} the string with the cyan background
 */
export function bgCyan (string: string): string {
  return `\u001B[46m${string}\u001B[49m`
}

/**
 * Render a string on a white background for the terminal
 * @param string the string to render
 * @returns {string} the string with the white background
 */
export function bgWhite (string: string): string {
  return `\u001B[47m${string}\u001B[49m`
}

/**
 * Render a string on a gray background for the terminal
 * @param string the string to render
 * @returns {string} the string with the gray background
 */
export function bgGray (string: string): string {
  return `\u001B[100m${string}\u001B[49m`
}

/**
 * Convert a hex color to rgb
 * @param hex the hex color like "#0f0" or "#00ff00"
 * @returns {object} the rgb color like { colorRed: 12, colorGreen: 24, colorBlue: 42 }
 * @example hexToRgb("#0f0") // { colorRed: 0, colorGreen: 255, colorBlue: 0 }
 */
export function hexToRgb (hex: string): { colorRed: number; colorGreen: number; colorBlue: number } {
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  if (hex.length === Nb.ShortHex) return {
    colorRed: Number(`0x${hex[Nb.One]}${hex[Nb.One]}`),
    colorGreen: Number(`0x${hex[Nb.Two]}${hex[Nb.Two]}`),
    colorBlue: Number(`0x${hex[Nb.Three]}${hex[Nb.Three]}`),
  }
  if (hex.length === Nb.LongHex) return {
    colorRed: Number(`0x${hex[Nb.One]}${hex[Nb.Two]}`),
    colorGreen: Number(`0x${hex[Nb.Three]}${hex[Nb.Four]}`),
    colorBlue: Number(`0x${hex[Nb.Five]}${hex[Nb.Six]}`),
  }
  /* eslint-enable @typescript-eslint/restrict-template-expressions */
  throw new Error(`Invalid HEX color provided : ${hex}, should have a length of ${Nb.ShortHex} or ${Nb.LongHex} instead of : ${hex.length}`)
}

// Credits to https://css-tricks.com/converting-color-spaces-in-javascript/
/**
 * Transform a HEX color to HSL
 * @param hex "#000000"
 * @returns {string} "hsl(0, 0%, 0%)"
 */
// eslint-disable-next-line max-statements
export function hexToHsl (hex: string): { hue: number; lightness: number; saturation: number } {
  let { colorRed, colorGreen, colorBlue } = hexToRgb(hex) // Convert hex to RGB first
  // Then to HSL
  colorRed /= Nb.RgbMax
  colorGreen /= Nb.RgbMax
  colorBlue /= Nb.RgbMax
  const min = Math.min(colorRed, colorGreen, colorBlue)
  const max = Math.max(colorRed, colorGreen, colorBlue)
  const delta = max - min
  let hue = Number(Nb.HslMin)
  let saturation = Nb.HslMin
  let lightness = Nb.HslMin
  if (delta === 0) hue = Nb.HslMin
  else if (max === colorRed) hue = ((colorGreen - colorBlue) / delta) % Nb.Six
  else if (max === colorGreen) hue = (colorBlue - colorRed) / delta + Number(Nb.Two)
  else hue = (colorRed - colorGreen) / delta + Number(Nb.Four)
  hue = Math.round(hue * Nb.HueStep)
  if (hue < 0) hue += Number(Nb.HueMax)
  lightness = (max + min) / Nb.Two
  saturation = delta === 0 ? 0 : delta / (1 - Math.abs(Nb.Two * lightness - 1))
  saturation = Math.round(saturation * Nb.SaturationMax)
  lightness = Math.round(lightness * Nb.LightnessMax)
  return { hue, saturation, lightness }
}

