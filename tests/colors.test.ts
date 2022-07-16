import { test } from 'uvu'
import { ok } from 'uvu/assert'
import { hexToHsl, red, yellow } from '../src'
import { check } from './utils'

test('colored strings are still strings :)', function () {
  console.log(yellow(':D'))
  ok(red('plop'))
})

check('color red short : hex => hsl', hexToHsl('#f00'), { h: 0, s: 100, l: 50 })
check('color red long : hex => hsl', hexToHsl('#ff0000'), { h: 0, s: 100, l: 50 })
check('color rebeccapurple : hex => hsl', hexToHsl('#663399'), { h: 270, s: 50, l: 40 })

test.run()
