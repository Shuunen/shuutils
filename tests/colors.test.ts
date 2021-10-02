import { ok } from 'assert'
import { red, yellow } from '../src'

describe('colors', function () {

  it('colored strings are still strings :)', function () {
    console.log(yellow(':D'))
    ok(red('plop'))
  })

})
