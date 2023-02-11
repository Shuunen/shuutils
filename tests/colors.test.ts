import { expect, it } from 'vitest'
import { bgBlack, bgBlue, bgCyan, bgGray, bgGreen, bgMagenta, bgRed, bgWhite, bgYellow, black, blue, bold, cyan, dim, gray, green, hexToHsl, hexToRgb, inverse, italic, magenta, overline, red, reset, strikeThrough, underline, white, yellow } from '../src'
import { check, checkSnapshot } from './utils'

checkSnapshot('color reset', reset('test'))
checkSnapshot('color bold', bold('test'))
checkSnapshot('color dim', dim('test'))
checkSnapshot('color italic', italic('test'))
checkSnapshot('color underline', underline('test'))
checkSnapshot('color overline', overline('test'))
checkSnapshot('color inverse', inverse('test'))
checkSnapshot('color strikeThrough', strikeThrough('test'))
checkSnapshot('color black', black('test'))
checkSnapshot('color red', red('test'))
checkSnapshot('color green', green('test'))
checkSnapshot('color yellow', yellow('test'))
checkSnapshot('color blue', blue('test'))
checkSnapshot('color magenta', magenta('test'))
checkSnapshot('color cyan', cyan('test'))
checkSnapshot('color white', white('test'))
checkSnapshot('color gray', gray('test'))
checkSnapshot('color bgBlack', bgBlack('test'))
checkSnapshot('color bgRed', bgRed('test'))
checkSnapshot('color bgGreen', bgGreen('test'))
checkSnapshot('color bgYellow', bgYellow('test'))
checkSnapshot('color bgBlue', bgBlue('test'))
checkSnapshot('color bgMagenta', bgMagenta('test'))
checkSnapshot('color bgCyan', bgCyan('test'))
checkSnapshot('color bgWhite', bgWhite('test'))
checkSnapshot('color bgGray', bgGray('test'))

check('color hexToRgb A', hexToRgb('#f00'), { colorRed: 255, colorGreen: 0, colorBlue: 0 })
check('color hexToRgb B', hexToRgb('#0f0'), { colorRed: 0, colorGreen: 255, colorBlue: 0 })
check('color hexToRgb C', hexToRgb('#00f'), { colorRed: 0, colorGreen: 0, colorBlue: 255 })
check('color hexToRgb D', hexToRgb('#ff0000'), { colorRed: 255, colorGreen: 0, colorBlue: 0 })
it('color hexToRgb E', () => {
  expect(() => hexToRgb('#00')).toThrowError(/invalid/iu)
})

check('color hexToHsl A red short', hexToHsl('#f00'), { hue: 0, saturation: 100, lightness: 50 })
check('color hexToHsl B red long', hexToHsl('#ff0000'), { hue: 0, saturation: 100, lightness: 50 })
check('color hexToHsl C', hexToHsl('#663399'), { hue: 270, saturation: 50, lightness: 40 })
check('color hexToHsl D', hexToHsl('#000000'), { hue: 0, saturation: 0, lightness: 0 })
check('color hexToHsl E', hexToHsl('#ffffff'), { hue: 0, saturation: 0, lightness: 100 })
check('color hexToHsl F green short', hexToHsl('#0f0'), { hue: 120, saturation: 100, lightness: 50 })
check('color hexToHsl G green long', hexToHsl('#00ff00'), { hue: 120, saturation: 100, lightness: 50 })
check('color hexToHsl H blue short', hexToHsl('#00f'), { hue: 240, saturation: 100, lightness: 50 })



