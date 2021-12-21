// Credits to : https://github.com/sindresorhus/yoctocolors/blob/main/index.js
export const reset = (string: string) => '\u001B[' + 0 + 'm' + string + '\u001B[' + 0 + 'm'
export const bold = (string: string) => '\u001B[' + 1 + 'm' + string + '\u001B[' + 22 + 'm'
export const dim = (string: string) => '\u001B[' + 2 + 'm' + string + '\u001B[' + 22 + 'm'
export const italic = (string: string) => '\u001B[' + 3 + 'm' + string + '\u001B[' + 23 + 'm'
export const underline = (string: string) => '\u001B[' + 4 + 'm' + string + '\u001B[' + 24 + 'm'
export const overline = (string: string) => '\u001B[' + 53 + 'm' + string + '\u001B[' + 55 + 'm'
export const inverse = (string: string) => '\u001B[' + 7 + 'm' + string + '\u001B[' + 27 + 'm'
export const hidden = (string: string) => '\u001B[' + 8 + 'm' + string + '\u001B[' + 28 + 'm'
export const strikeThrough = (string: string) => '\u001B[' + 9 + 'm' + string + '\u001B[' + 29 + 'm'

export const black = (string: string) => '\u001B[' + 30 + 'm' + string + '\u001B[' + 39 + 'm'
export const red = (string: string) => '\u001B[' + 31 + 'm' + string + '\u001B[' + 39 + 'm'
export const green = (string: string) => '\u001B[' + 32 + 'm' + string + '\u001B[' + 39 + 'm'
export const yellow = (string: string) => '\u001B[' + 33 + 'm' + string + '\u001B[' + 39 + 'm'
export const blue = (string: string) => '\u001B[' + 34 + 'm' + string + '\u001B[' + 39 + 'm'
export const magenta = (string: string) => '\u001B[' + 35 + 'm' + string + '\u001B[' + 39 + 'm'
export const cyan = (string: string) => '\u001B[' + 36 + 'm' + string + '\u001B[' + 39 + 'm'
export const white = (string: string) => '\u001B[' + 37 + 'm' + string + '\u001B[' + 39 + 'm'
export const gray = (string: string) => '\u001B[' + 90 + 'm' + string + '\u001B[' + 39 + 'm'

export const bgBlack = (string: string) => '\u001B[' + 40 + 'm' + string + '\u001B[' + 49 + 'm'
export const bgRed = (string: string) => '\u001B[' + 41 + 'm' + string + '\u001B[' + 49 + 'm'
export const bgGreen = (string: string) => '\u001B[' + 42 + 'm' + string + '\u001B[' + 49 + 'm'
export const bgYellow = (string: string) => '\u001B[' + 43 + 'm' + string + '\u001B[' + 49 + 'm'
export const bgBlue = (string: string) => '\u001B[' + 44 + 'm' + string + '\u001B[' + 49 + 'm'
export const bgMagenta = (string: string) => '\u001B[' + 45 + 'm' + string + '\u001B[' + 49 + 'm'
export const bgCyan = (string: string) => '\u001B[' + 46 + 'm' + string + '\u001B[' + 49 + 'm'
export const bgWhite = (string: string) => '\u001B[' + 47 + 'm' + string + '\u001B[' + 49 + 'm'
export const bgGray = (string: string) => '\u001B[' + 100 + 'm' + string + '\u001B[' + 49 + 'm'

// Credits to https://css-tricks.com/converting-color-spaces-in-javascript/
/**
 * Transform a HEX color to HSL
 * @param hex "#000000"
 * @returns {string} "hsl(0, 0%, 0%)"
 */
export function hexToHsl (hex: string) {
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
