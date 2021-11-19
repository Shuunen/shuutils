import { ok } from 'assert'
import { test } from 'uvu'
import { red, yellow } from '../src'

test('colored strings are still strings :)', function () {
  console.log(yellow(':D'))
  ok(red('plop'))
})

test.run()
