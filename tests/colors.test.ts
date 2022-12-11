import { check, checksRun, hexToHsl } from '../src'

check('color red short : hex => hsl', hexToHsl('#f00'), { hue: 0, saturation: 100, lightness: 50 })
check('color red long : hex => hsl', hexToHsl('#ff0000'), { hue: 0, saturation: 100, lightness: 50 })
check('color rebeccapurple : hex => hsl', hexToHsl('#663399'), { hue: 270, saturation: 50, lightness: 40 })

checksRun()
