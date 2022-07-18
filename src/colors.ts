// Credits to : https://github.com/sindresorhus/yoctocolors/blob/main/index.js

/**
 * Reset the string color to the default terminal color
 * @param string the string to reset
 * @returns {string} the string with the reset color
 */
export const reset = (string: string): string => '\u001B[' + 0 + 'm' + string + '\u001B[' + 0 + 'm'

/**
 * Render a bold string for the terminal
 * @param string the string to render
 * @returns {string} the string with the bold decoration
 */
export const bold = (string: string): string => '\u001B[' + 1 + 'm' + string + '\u001B[' + 22 + 'm'

/**
 * Render a dim string for the terminal
 * @param string the string to render
 * @returns {string} the string with the dim decoration
 */
export const dim = (string: string): string => '\u001B[' + 2 + 'm' + string + '\u001B[' + 22 + 'm'

/**
 * Render a italic string for the terminal
 * @param string the string to render
 * @returns {string} the string with the italic decoration
 */
export const italic = (string: string): string => '\u001B[' + 3 + 'm' + string + '\u001B[' + 23 + 'm'

/**
 * Render a underline string for the terminal
 * @param string the string to render
 * @returns {string} the string with the underline decoration
 */
export const underline = (string: string): string => '\u001B[' + 4 + 'm' + string + '\u001B[' + 24 + 'm'

/**
 * Render a overline string for the terminal
 * @param string the string to render
 * @returns {string} the string with the overline decoration
 */
export const overline = (string: string): string => '\u001B[' + 53 + 'm' + string + '\u001B[' + 55 + 'm'

/**
 * Render an inverse string for the terminal
 * @param string the string to render
 * @returns {string} the string with the inverse decoration
 */
export const inverse = (string: string): string => '\u001B[' + 7 + 'm' + string + '\u001B[' + 27 + 'm'

/**
 * Render a strike-through string for the terminal
 * @param string the string to render
 * @returns {string} the string with the strike-through decoration
 */
export const strikeThrough = (string: string): string => '\u001B[' + 9 + 'm' + string + '\u001B[' + 29 + 'm'

/**
 * Render a black string for the terminal
 * @param string the string to render
 * @returns {string} the string with the black color
 */
export const black = (string: string): string => '\u001B[' + 30 + 'm' + string + '\u001B[' + 39 + 'm'

/**
 * Render a red string for the terminal
 * @param string the string to render
 * @returns {string} the string with the red color
 */
export const red = (string: string): string => '\u001B[' + 31 + 'm' + string + '\u001B[' + 39 + 'm'

/**
 * Render a green string for the terminal
 * @param string the string to render
 * @returns {string} the string with the green color
 */
export const green = (string: string): string => '\u001B[' + 32 + 'm' + string + '\u001B[' + 39 + 'm'

/**
 * Render a yellow string for the terminal
 * @param string the string to render
 * @returns {string} the string with the yellow color
 */
export const yellow = (string: string): string => '\u001B[' + 33 + 'm' + string + '\u001B[' + 39 + 'm'

/**
 * Render a blue string for the terminal
 * @param string the string to render
 * @returns {string} the string with the blue color
 */
export const blue = (string: string): string => '\u001B[' + 34 + 'm' + string + '\u001B[' + 39 + 'm'

/**
 * Render a magenta string for the terminal
 * @param string the string to render
 * @returns {string} the string with the magenta color
 */
export const magenta = (string: string): string => '\u001B[' + 35 + 'm' + string + '\u001B[' + 39 + 'm'

/**
 * Render a cyan string for the terminal
 * @param string the string to render
 * @returns {string} the string with the cyan color
 */
export const cyan = (string: string): string => '\u001B[' + 36 + 'm' + string + '\u001B[' + 39 + 'm'

/**
 * Render a white string for the terminal
 * @param string the string to render
 * @returns {string} the string with the white color
 */
export const white = (string: string): string => '\u001B[' + 37 + 'm' + string + '\u001B[' + 39 + 'm'

/**
 * Render a gray string for the terminal
 * @param string the string to render
 * @returns {string} the string with the gray color
 */
export const gray = (string: string): string => '\u001B[' + 90 + 'm' + string + '\u001B[' + 39 + 'm'


/**
 * Render a string on a black background for the terminal
 * @param string the string to render
 * @returns {string} the string with the black background
 */
export const bgBlack = (string: string): string => '\u001B[' + 40 + 'm' + string + '\u001B[' + 49 + 'm'

/**
 * Render a string on a red background for the terminal
 * @param string the string to render
 * @returns {string} the string with the red background
 */
export const bgRed = (string: string): string => '\u001B[' + 41 + 'm' + string + '\u001B[' + 49 + 'm'

/**
 * Render a string on a green background for the terminal
 * @param string the string to render
 * @returns {string} the string with the green background
 */
export const bgGreen = (string: string): string => '\u001B[' + 42 + 'm' + string + '\u001B[' + 49 + 'm'

/**
 * Render a string on a yellow background for the terminal
 * @param string the string to render
 * @returns {string} the string with the yellow background
 */
export const bgYellow = (string: string): string => '\u001B[' + 43 + 'm' + string + '\u001B[' + 49 + 'm'

/**
 * Render a string on a blue background for the terminal
 * @param string the string to render
 * @returns {string} the string with the blue background
 */
export const bgBlue = (string: string): string => '\u001B[' + 44 + 'm' + string + '\u001B[' + 49 + 'm'

/**
 * Render a string on a magenta background for the terminal
 * @param string the string to render
 * @returns {string} the string with the magenta background
 */
export const bgMagenta = (string: string): string => '\u001B[' + 45 + 'm' + string + '\u001B[' + 49 + 'm'

/**
 * Render a string on a cyan background for the terminal
 * @param string the string to render
 * @returns {string} the string with the cyan background
 */
export const bgCyan = (string: string): string => '\u001B[' + 46 + 'm' + string + '\u001B[' + 49 + 'm'

/**
 * Render a string on a white background for the terminal
 * @param string the string to render
 * @returns {string} the string with the white background
 */
export const bgWhite = (string: string): string => '\u001B[' + 47 + 'm' + string + '\u001B[' + 49 + 'm'

/**
 * Render a string on a gray background for the terminal
 * @param string the string to render
 * @returns {string} the string with the gray background
 */
export const bgGray = (string: string): string => '\u001B[' + 100 + 'm' + string + '\u001B[' + 49 + 'm'


// Credits to https://css-tricks.com/converting-color-spaces-in-javascript/
/**
 * Transform a HEX color to HSL
 * @param hex "#000000"
 * @returns {string} "hsl(0, 0%, 0%)"
 */
export function hexToHsl (hex: string): { h: number; l: number; s: number } {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0
  if (hex.length === 4) {
    r = Number('0x' + hex[1] + hex[1])
    g = Number('0x' + hex[2] + hex[2])
    b = Number('0x' + hex[3] + hex[3])
  } else if (hex.length === 7) {
    r = Number('0x' + hex[1] + hex[2])
    g = Number('0x' + hex[3] + hex[4])
    b = Number('0x' + hex[5] + hex[6])
  }
  // Then to HSL
  r /= 255
  g /= 255
  b /= 255
  const min = Math.min(r, g, b), max = Math.max(r, g, b), delta = max - min
  let h = 0, s = 0, l = 0
  if (delta === 0) h = 0
  else if (max === r) h = ((g - b) / delta) % 6
  else if (max === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4
  h = Math.round(h * 60)
  if (h < 0) h += 360
  l = (max + min) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = Math.round(s * 100)
  l = Math.round(l * 100)
  return { h, s, l }
}
