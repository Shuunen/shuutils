
import { check, checksRun, hasOwn, sleep } from '../src'

check('hasOwn A', hasOwn({ propA: 1 }, 'propA'), true)
check('hasOwn B', hasOwn({ propA: 1 }, 'propB'), false)
check('hasOwn C', hasOwn({ propA: 1 }, 'toString'), false)
check('hasOwn D', hasOwn({ propA: 1 }, 'hasOwnProperty'), false)

check('sleep A', sleep(10), Promise.resolve(10))
check('sleep B', sleep(20), 20)

checksRun()

