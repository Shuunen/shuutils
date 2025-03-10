import {
  nbFifth,
  nbFourth,
  nbHslMin,
  nbHueMax,
  nbHueStep,
  nbLightnessMax,
  nbLongHex,
  nbRgbMax,
  nbSaturationMax,
  nbSecond,
  nbSeventh,
  nbShortHex,
  nbSixth,
  nbThird,
} from './constants'
import { Result } from './result'

/**
 * Convert a hex color to rgb
 * @param hex the hex color like "#0f0" or "#00ff00"
 * @returns the rgb color like { colorRed: 12, colorGreen: 24, colorBlue: 42 }
 */
export function hexToRgb(hex: string) {
  if (hex.length === nbShortHex)
    return Result.ok({
      colorBlue: Number(`0x${hex[nbFourth]}${hex[nbFourth]}`),
      colorGreen: Number(`0x${hex[nbThird]}${hex[nbThird]}`),
      colorRed: Number(`0x${hex[nbSecond]}${hex[nbSecond]}`),
    })
  if (hex.length === nbLongHex)
    return Result.ok({
      colorBlue: Number(`0x${hex[nbSixth]}${hex[nbSeventh]}`),
      colorGreen: Number(`0x${hex[nbFourth]}${hex[nbFifth]}`),
      colorRed: Number(`0x${hex[nbSecond]}${hex[nbThird]}`),
    })
  return Result.error(`Invalid HEX color provided : ${hex}, should have a length of ${nbShortHex} or ${nbLongHex} instead of : ${hex.length}`)
}

// Credits to https://css-tricks.com/converting-color-spaces-in-javascript/
/**
 * Transform a HEX color to HSL
 * @param hex "#000000"
 * @returns object like { hue: 0, saturation: 0, lightness: 0 }
 */
// eslint-disable-next-line max-statements
export function hexToHsl(hex: string) {
  const result = hexToRgb(hex) // Convert hex to RGB first
  if (!result.ok) return result
  let { colorBlue, colorGreen, colorRed } = result.value
  // Then to HSL
  colorRed /= nbRgbMax
  colorGreen /= nbRgbMax
  colorBlue /= nbRgbMax
  const min = Math.min(colorRed, colorGreen, colorBlue)
  const max = Math.max(colorRed, colorGreen, colorBlue)
  const delta = max - min
  let hue = nbHslMin // eslint-disable-line no-useless-assignment
  let saturation = nbHslMin // eslint-disable-line no-useless-assignment
  let lightness = nbHslMin // eslint-disable-line no-useless-assignment
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
  return { hue, lightness, saturation }
}
