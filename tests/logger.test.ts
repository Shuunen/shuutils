import { Logger, LogLevel, red } from '../src'
import { check, checkSnapshot } from './utils'

const loggerA = new Logger()
check('loggerA is active', loggerA.options.isActive, true)
loggerA.info('This info 0 should be logged')

const loggerB = new Logger({ isActive: false, willLogDelay: false, willOutputToMemory: true, willOutputToConsole: false })
check('loggerB is not active', loggerB.options.isActive, false)
loggerB.info('This info 1 should not be logged')
loggerB.options.isActive = true
loggerB.info('This info 2 should be logged')
loggerB.info('This info 3 should be logged too')
loggerB.success('This success 0 should be logged')
loggerB.warn('This warn 1 should be logged')
checkSnapshot('loggerB inMemoryLogs', loggerB.inMemoryLogs)

const loggerC = new Logger({ willLogDate: true, willLogTime: true, willOutputToConsole: false, willLogDelay: true, minimumLevel: LogLevel.Error, willOutputToMemory: true })
loggerC.warn('This warn 2 should not be logged')
loggerC.success('This success 1 should not be logged')
loggerC.error('This error 1 should be logged')
loggerC.disable()
loggerC.error('This error 2 should not be logged')
loggerC.enable()
loggerC.error('This error 3 should be logged')
loggerC.test(true, 'This test 1 should not be logged')
loggerC.options.minimumLevel = LogLevel.Test
loggerC.test(true, 'This test 2 should be logged')
loggerC.test(false, 'This test 3 should be logged')
// cannot use checkSnapshot because of the date
check('loggerC has 4 inMemoryLogs', loggerC.inMemoryLogs.length, 4)

const loggerD = new Logger({ willLogDelay: false, willOutputToMemory: true, willOutputToConsole: false })
loggerD.info('This info 4 should be logged', 12)
loggerD.info('This info 5 should be logged too', [1, 2, 3])
loggerD.warn('This warn 3 should be logged', { keyA: 1, keyB: 'John', isKeyC: true })
loggerD.disable()
loggerD.warn('This warn 4 should not be logged')
loggerD.error('This error 4 should not be logged')
loggerD.enable()
loggerD.error('This error 5 should be logged', null) // eslint-disable-line unicorn/no-null
loggerD.test(true, 'This test 4 should be logged', undefined) // eslint-disable-line unicorn/no-useless-undefined
loggerD.test(false, 'This test 5 should be logged', () => 'Hello world')
loggerD.debug('This debug 1 should be logged', true, [], {})
loggerD.options.minimumLevel = LogLevel.Info
loggerD.debug('This debug 2 should not be logged')
checkSnapshot('loggerD inMemoryLogs', loggerD.inMemoryLogs)

const loggerE = new Logger({ willOutputToConsole: false })
check('loggerE clean A', loggerE.clean(), '')
check('loggerE clean B', loggerE.clean(red('Oh I\'m in red now ?!')), 'Oh I\'m in red now ?!')
check('loggerE clean C', loggerE.clean('an array ?', [12, 42]), 'an array ? [12,42]')
check('loggerE clean D', loggerE.clean('a function ?', () => 'Hello world'), 'a function ? () => \'Hello world\'')
check('loggerE clean E', loggerE.clean('an object ?', { keyA: 1, keyB: 'John', isFull: true }), 'an object ? {\'keyA\':1,\'keyB\':\'John\',\'isFull\':true}')
check('loggerE clean F', loggerE.clean('a boolean ?', true), 'a boolean ? true')
check('loggerE clean G', loggerE.clean('a number ?', 42), 'a number ? 42')
check('loggerE clean H', loggerE.clean('a string ?', 'Hello world'), 'a string ? Hello world')
check('loggerE clean I', loggerE.clean('a null ?', null), 'a null ? null') // eslint-disable-line unicorn/no-null
check('loggerE clean J', loggerE.clean('an undefined ?', undefined), 'an undefined ? undefined') // eslint-disable-line unicorn/no-useless-undefined
check('loggerE clean K', loggerE.clean('a date ?', new Date('2020-01-01')), 'a date ? \'2020-01-01T00:00:00.000Z\'')
check('loggerE clean L', loggerE.clean('a regexp ?', /Hello world{3,5}/u), 'a regexp ? {}') // not supported for now

