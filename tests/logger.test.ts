import { expect, it } from 'vitest'
import { Logger, red } from '../src'

it('logger A', () => {
  const loggerA = new Logger()
  expect(loggerA.options.isActive).toBe(true)
  loggerA.info('This info 0 should be logged')
})

it('logger B', () => {
  const loggerB = new Logger({ isActive: false, willLogDelay: false, willOutputToMemory: true, willOutputToConsole: false })
  expect(loggerB.options.isActive).toBe(false)
  loggerB.info('This info 1 should not be logged')
  loggerB.options.isActive = true
  loggerB.info('This info 2 should be logged')
  loggerB.info('This info 3 should be logged too')
  loggerB.success('This success 0 should be logged')
  loggerB.warn('This warn 1 should be logged')
  expect(loggerB.inMemoryLogs, 'loggerB inMemoryLogs').toMatchSnapshot()
})

it('logger C', () => {
  const loggerC = new Logger({ willLogDate: true, willLogTime: true, willOutputToConsole: false, willLogDelay: true, minimumLevel: '6-error', willOutputToMemory: true })
  loggerC.warn('This warn 2 should not be logged')
  loggerC.success('This success 1 should not be logged')
  loggerC.error('This error 1 should be logged')
  loggerC.disable()
  loggerC.error('This error 2 should not be logged')
  loggerC.enable()
  loggerC.error('This error 3 should be logged')
  loggerC.test(true, 'This test 1 should not be logged')
  loggerC.options.minimumLevel = '2-test'
  loggerC.test(true, 'This test 2 should be logged')
  loggerC.test(false, 'This test 3 should be logged')
  // cannot use checkSnapshot because of the date
  expect(loggerC.inMemoryLogs.length, 'loggerC has 4 inMemoryLogs').toBe(4)
})

it('logger D', () => {
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
  loggerD.options.minimumLevel = '3-info'
  loggerD.debug('This debug 2 should not be logged')
  expect(loggerD.inMemoryLogs, 'loggerD inMemoryLogs').toMatchSnapshot()
})

const loggerE = new Logger({ willOutputToConsole: false })
it('loggerE clean A', () => { expect(loggerE.clean()).toBe('') })
it('loggerE clean B', () => { expect(loggerE.clean(red('Oh I\'m in red now ?!'))).toBe('Oh I\'m in red now ?!') })
it('loggerE clean C', () => { expect(loggerE.clean('an array ?', [12, 42])).toBe('an array ? [12,42]') })
it('loggerE clean D', () => { expect(loggerE.clean('a function ?', () => 'Hello world')).toBe('a function ? () => \'Hello world\'') })
it('loggerE clean E', () => { expect(loggerE.clean('an object ?', { keyA: 1, keyB: 'John', isFull: true })).toBe('an object ? {\'keyA\':1,\'keyB\':\'John\',\'isFull\':true}') })
it('loggerE clean F', () => { expect(loggerE.clean('a boolean ?', true)).toBe('a boolean ? true') })
it('loggerE clean G', () => { expect(loggerE.clean('a number ?', 42)).toBe('a number ? 42') })
it('loggerE clean H', () => { expect(loggerE.clean('a string ?', 'Hello world')).toBe('a string ? Hello world') })
it('loggerE clean I', () => { expect(loggerE.clean('a null ?', null)).toBe('a null ? null') }) // eslint-disable-line unicorn/no-null
it('loggerE clean J', () => { expect(loggerE.clean('an undefined ?', undefined)).toBe('an undefined ? undefined') }) // eslint-disable-line unicorn/no-useless-undefined
it('loggerE clean K', () => { expect(loggerE.clean('a date ?', new Date('2020-01-01'))).toBe('a date ? \'2020-01-01T00:00:00.000Z\'') })
it('loggerE clean L', () => { expect(loggerE.clean('a regexp ?', /Hello world{3,5}/u)).toBe('a regexp ? {}') }) // not supported for now

