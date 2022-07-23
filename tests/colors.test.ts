import { check, hexToHsl } from '../src'

check('color red short : hex => hsl', hexToHsl('#f00'), { h: 0, s: 100, l: 50 })
check('color red long : hex => hsl', hexToHsl('#ff0000'), { h: 0, s: 100, l: 50 })
check('color rebeccapurple : hex => hsl', hexToHsl('#663399'), { h: 270, s: 50, l: 40 })

check.run()
