// Credits to : https://github.com/sindresorhus/yoctocolors/blob/main/index.js
import { nbFifth, nbFourth, nbHslMin, nbHueMax, nbHueStep, nbLightnessMax, nbLongHex, nbRgbMax, nbSaturationMax, nbSecond, nbSeventh, nbShortHex, nbSixth, nbThird } from './constants'

/**
 * Reset the string color to the default terminal color
 * @param string the string to reset
 * @returns the string with the reset color
 */
export function reset (string: string) {
  return `\u001B[0m${string}\u001B[0m`
}

/**
 * Render a bold string for the terminal
 * @param string the string to render
 * @returns the string with the bold decoration
 */
export function bold (string: string) {
  return `\u001B[1m${string}\u001B[22m`
}

/**
 * Render a dim string for the terminal
 * @param string the string to render
 * @returns the string with the dim decoration
 */
export function dim (string: string) {
  return `\u001B[2m${string}\u001B[22m`
}

/**
 * Render a italic string for the terminal
 * @param string the string to render
 * @returns the string with the italic decoration
 */
export function italic (string: string) {
  return `\u001B[3m${string}\u001B[23m`
}

/**
 * Render a underline string for the terminal
 * @param string the string to render
 * @returns the string with the underline decoration
 */
export function underline (string: string) {
  return `\u001B[4m${string}\u001B[24m`
}

/**
 * Render a overline string for the terminal
 * @param string the string to render
 * @returns the string with the overline decoration
 */
export function overline (string: string) {
  return `\u001B[53m${string}\u001B[55m`
}

/**
 * Render an inverse string for the terminal
 * @param string the string to render
 * @returns the string with the inverse decoration
 */
export function inverse (string: string) {
  return `\u001B[7m${string}\u001B[27m`
}

/**
 * Render a strike-through string for the terminal
 * @param string the string to render
 * @returns the string with the strike-through decoration
 */
export function strikeThrough (string: string) {
  return `\u001B[9m${string}\u001B[29m`
}

/**
 * Render a black string for the terminal
 * @param string the string to render
 * @returns the string with the black color
 */
export function black (string: string) {
  return `\u001B[30m${string}\u001B[39m`
}

/**
 * Render a red string for the terminal
 * @param string the string to render
 * @returns the string with the red color
 */
export function red (string: string) {
  return `\u001B[31m${string}\u001B[39m`
}

/**
 * Render a green string for the terminal
 * @param string the string to render
 * @returns the string with the green color
 */
export function green (string: string) {
  return `\u001B[32m${string}\u001B[39m`
}

/**
 * Render a yellow string for the terminal
 * @param string the string to render
 * @returns the string with the yellow color
 */
export function yellow (string: string) {
  return `\u001B[33m${string}\u001B[39m`
}

/**
 * Render a blue string for the terminal
 * @param string the string to render
 * @returns the string with the blue color
 */
export function blue (string: string) {
  return `\u001B[34m${string}\u001B[39m`
}

/**
 * Render a magenta string for the terminal
 * @param string the string to render
 * @returns the string with the magenta color
 */
export function magenta (string: string) {
  return `\u001B[35m${string}\u001B[39m`
}

/**
 * Render a cyan string for the terminal
 * @param string the string to render
 * @returns the string with the cyan color
 */
export function cyan (string: string) {
  return `\u001B[36m${string}\u001B[39m`
}

/**
 * Render a white string for the terminal
 * @param string the string to render
 * @returns the string with the white color
 */
export function white (string: string) {
  return `\u001B[37m${string}\u001B[39m`
}

/**
 * Render a gray string for the terminal
 * @param string the string to render
 * @returns the string with the gray color
 */
export function gray (string: string) {
  return `\u001B[90m${string}\u001B[39m`
}


/**
 * Render a string on a black background for the terminal
 * @param string the string to render
 * @returns the string with the black background
 */
export function bgBlack (string: string) {
  return `\u001B[40m${string}\u001B[49m`
}

/**
 * Render a string on a red background for the terminal
 * @param string the string to render
 * @returns the string with the red background
 */
export function bgRed (string: string) {
  return `\u001B[41m${string}\u001B[49m`
}

/**
 * Render a string on a green background for the terminal
 * @param string the string to render
 * @returns the string with the green background
 */
export function bgGreen (string: string) {
  return `\u001B[42m${string}\u001B[49m`
}

/**
 * Render a string on a yellow background for the terminal
 * @param string the string to render
 * @returns the string with the yellow background
 */
export function bgYellow (string: string) {
  return `\u001B[43m${string}\u001B[49m`
}

/**
 * Render a string on a blue background for the terminal
 * @param string the string to render
 * @returns the string with the blue background
 */
export function bgBlue (string: string) {
  return `\u001B[44m${string}\u001B[49m`
}

/**
 * Render a string on a magenta background for the terminal
 * @param string the string to render
 * @returns the string with the magenta background
 */
export function bgMagenta (string: string) {
  return `\u001B[45m${string}\u001B[49m`
}

/**
 * Render a string on a cyan background for the terminal
 * @param string the string to render
 * @returns the string with the cyan background
 */
export function bgCyan (string: string) {
  return `\u001B[46m${string}\u001B[49m`
}

/**
 * Render a string on a white background for the terminal
 * @param string the string to render
 * @returns the string with the white background
 */
export function bgWhite (string: string) {
  return `\u001B[47m${string}\u001B[49m`
}

/**
 * Render a string on a gray background for the terminal
 * @param string the string to render
 * @returns the string with the gray background
 */
export function bgGray (string: string) {
  return `\u001B[100m${string}\u001B[49m`
}

/**
 * Convert a hex color to rgb
 * @param hex the hex color like "#0f0" or "#00ff00"
 * @returns the rgb color like { colorRed: 12, colorGreen: 24, colorBlue: 42 }
 */
export function hexToRgb (hex: string) {
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  if (hex.length === nbShortHex) return {
    colorRed: Number(`0x${hex[nbSecond]}${hex[nbSecond]}`),
    colorGreen: Number(`0x${hex[nbThird]}${hex[nbThird]}`),
    colorBlue: Number(`0x${hex[nbFourth]}${hex[nbFourth]}`),
  }
  if (hex.length === nbLongHex) return {
    colorRed: Number(`0x${hex[nbSecond]}${hex[nbThird]}`),
    colorGreen: Number(`0x${hex[nbFourth]}${hex[nbFifth]}`),
    colorBlue: Number(`0x${hex[nbSixth]}${hex[nbSeventh]}`),
  }
  /* eslint-enable @typescript-eslint/restrict-template-expressions */
  throw new Error(`Invalid HEX color provided : ${hex}, should have a length of ${nbShortHex} or ${nbLongHex} instead of : ${hex.length}`)
}

// Credits to https://css-tricks.com/converting-color-spaces-in-javascript/
/**
 * Transform a HEX color to HSL
 * @param hex "#000000"
 * @returns object like { hue: 0, saturation: 0, lightness: 0 }
 */
// eslint-disable-next-line max-statements
export function hexToHsl (hex: string) {
  let { colorRed, colorGreen, colorBlue } = hexToRgb(hex) // Convert hex to RGB first
  // Then to HSL
  colorRed /= nbRgbMax
  colorGreen /= nbRgbMax
  colorBlue /= nbRgbMax
  const min = Math.min(colorRed, colorGreen, colorBlue)
  const max = Math.max(colorRed, colorGreen, colorBlue)
  const delta = max - min
  let hue = nbHslMin
  let saturation = nbHslMin
  let lightness = nbHslMin
  if (delta === 0) hue = nbHslMin
  else if (max === colorRed) hue = ((colorGreen - colorBlue) / delta) % nbSeventh
  else if (max === colorGreen) hue = (colorBlue - colorRed) / delta + nbThird
  else hue = (colorRed - colorGreen) / delta + nbFifth
  hue = Math.round(hue * nbHueStep)
  /* c8 ignore next */
  if (hue < 0) hue += nbHueMax
  lightness = (max + min) / nbThird
  saturation = delta === 0 ? 0 : delta / (1 - Math.abs(nbThird * lightness - 1))
  saturation = Math.round(saturation * nbSaturationMax)
  lightness = Math.round(lightness * nbLightnessMax)
  return { hue, saturation, lightness }
}

