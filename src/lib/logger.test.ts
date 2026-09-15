import { createInMemoryDriver } from './async-storage'
import { red } from './colors'
import { Logger } from './logger'
import { Result } from './result'
import { alignForSnap } from './testing-align-for-snap'

describe('logger', () => {
  it('logger A', () => {
    const loggerA = new Logger()
    expect(loggerA.options.isActive).toBe(true)
    loggerA.info('This info 0 should be logged')
  })

  it('logger B', async () => {
    const loggerB = new Logger({
      isActive: false,
      storage: createInMemoryDriver(),
      willLogDelay: false,
      willOutputToConsole: false,
    })
    expect(loggerB.options.isActive).toBe(false)
    loggerB.info('This info 1 should not be logged')
    loggerB.options.isActive = true
    loggerB.info('This info 2 should be logged')
    loggerB.info('This info 3 should be logged too')
    loggerB.success('This success 0 should be logged')
    loggerB.warn('This warn 1 should be logged')
    loggerB.fix('This fix 1 should be logged', 42)
    loggerB.error('This error 0 should be logged', { isKeyA: true, keyB: 'John' })
    loggerB.error(new Error('This error 1 should be logged too'))
    await expect(loggerB.getLogs()).resolves.toMatchSnapshot()
  })

  it('logger C', async () => {
    const storage = createInMemoryDriver(),
      loggerC = new Logger({
        minimumLevel: '7-error',
        storage,
        willLogDate: true,
        willLogDelay: false,
        willLogTime: true,
        willOutputToConsole: false,
      })
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
    const logs = await loggerC.getLogs()
    expect(logs.map(log => alignForSnap(log))).toMatchSnapshot()
  })

  it('logger D', async () => {
    const loggerD = new Logger({
      storage: createInMemoryDriver(),
      willLogDelay: false,
      willOutputToConsole: false,
    })
    loggerD.info('This info 4 should be logged', 12)
    loggerD.info('This info 5 should be logged too', [1, 2, 3])
    loggerD.warn('This warn 3 should be logged', { isKeyC: true, keyA: 1, keyB: 'John' })
    loggerD.disable()
    loggerD.warn('This warn 4 should not be logged')
    loggerD.error('This error 4 should not be logged')
    loggerD.enable()
    loggerD.error('This error 5 should be logged', null)
    loggerD.test(true, 'This test 4 should be logged', undefined)
    loggerD.test(false, 'This test 5 should be logged', () => 'Hello world')
    loggerD.debug('This debug 1 should be logged', true, [], {})
    loggerD.options.minimumLevel = '3-info'
    loggerD.debug('This debug 2 should not be logged')
    const logs = await loggerD.getLogs()
    expect(logs.map(log => alignForSnap(log))).toMatchSnapshot()
  })

  const loggerE = new Logger({ willOutputToConsole: false })

  it('logger clean A', () => {
    expect(loggerE.clean()).toBe('')
  })

  it('logger clean B', () => {
    expect(loggerE.clean(red("Oh I'm in red now ?!"))).toMatchInlineSnapshot('"Oh I\'m in red now ?!"')
  })

  it('logger clean C', () => {
    expect(loggerE.clean('an array ?', [12, 42])).toMatchInlineSnapshot('"an array ? [12,42]"')
  })

  it('logger clean D', () => {
    expect(loggerE.clean('a function ?', () => 'Hello world')).toMatchInlineSnapshot('"a function ? () => \'Hello world\'"')
  })

  it('logger clean E', () => {
    expect(loggerE.clean('an object ?', { isFull: true, keyA: 1, keyB: 'John' })).toMatchInlineSnapshot("\"an object ? {'isFull':true,'keyA':1,'keyB':'John'}\"")
  })

  it('logger clean F', () => {
    expect(loggerE.clean('a boolean ?', true)).toMatchInlineSnapshot('"a boolean ? true"')
  })

  it('logger clean G', () => {
    expect(loggerE.clean('a number ?', 42)).toMatchInlineSnapshot('"a number ? 42"')
  })

  it('logger clean H', () => {
    expect(loggerE.clean('a string ?', 'Hello world')).toMatchInlineSnapshot('"a string ? Hello world"')
  })

  it('logger clean I', () => {
    expect(loggerE.clean('a null ?', null)).toMatchInlineSnapshot('"a null ? null"')
  })

  it('logger clean J', () => {
    expect(loggerE.clean('an undefined ?', undefined)).toMatchInlineSnapshot('"an undefined ? undefined"')
  })

  it('logger clean K', () => {
    expect(loggerE.clean('a date ?', new Date('2020-01-01'))).toMatchInlineSnapshot(`"a date ? {'__date__':'2020-01-01T00:00:00.000Z'}"`)
  })

  it('logger clean L', () => {
    expect(loggerE.clean('a regexp ?', /Hello world{3,5}/u)).toMatchInlineSnapshot(`"a regexp ? {'__regexFlags__':'u','__regexSource__':'Hello world{3,5}'}"`)
  }) // not supported for now

  it('logger F show', async () => {
    const loggerF = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false })
    loggerF.showInfo('This info 1 should be logged', 12)
    loggerF.info('This info 2 should be logged too', [1, 2, 3])
    loggerF.warn('This warn 3 should be logged', { isKeyC: true, keyA: 1, keyB: 'John' })
    loggerF.showError('This error 4 should not be logged')
    loggerF.error('This error 5 should be logged', null)
    loggerF.showSuccess('This success 6 should be logged', 12)
    loggerF.test(true, 'This test 7 should be logged', undefined)
    loggerF.test(false, 'This test 8 should be logged', () => 'Hello world')
    loggerF.debug('This debug 9 should be logged', true, [], {})
    loggerF.options.minimumLevel = '3-info'
    loggerF.debug('This debug 10 should not be logged')
    const logs = await loggerF.getLogs()
    expect(logs.map(log => alignForSnap(log))).toMatchSnapshot()
  })

  it('logger G should log with context', async () => {
    const loggerG = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false })
    loggerG.setContext({ user: { id: 1, name: 'John Doe' } })
    loggerG.info('This info 1 should be logged')
    const logs = await loggerG.getLogs()
    expect(alignForSnap(logs)).toMatchInlineSnapshot(`" info This info 1 should be logged {'context':{'user':{'id':1,'name':'John Doe'}}}"`)
    loggerG.clearContext()
    loggerG.info('This info 2 should be logged too but without context')
    const logs2 = await loggerG.getLogs()
    expect(alignForSnap(logs2)).toMatchInlineSnapshot(`" info This info 1 should be logged {'context':{'user':{'id':1,'name':'John Doe'}}} |  info This info 2 should be logged too but without context"`)
  })

  it('logger result A should log ok result with default levels', async () => {
    const loggerG = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false }),
      okResult = Result.ok({ data: 'success' })
    loggerG.result('test operation', okResult)
    const logs = await loggerG.getLogs()
    expect(alignForSnap(logs)).toMatchInlineSnapshot(`" info test operation result was ok and returned : {'data':'success'}"`)
  })

  it('logger result B should log error result with default levels', async () => {
    const loggerH = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false }),
      errorResult = Result.error('something went wrong')
    loggerH.result('test operation', errorResult)
    const logs = await loggerH.getLogs()
    expect(alignForSnap(logs)).toMatchInlineSnapshot(`"error test operation result was error and returned : something went wrong"`)
  })

  it('logger result C should log ok result with custom levels', async () => {
    const loggerI = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false }),
      okResult = Result.ok(42)
    loggerI.result('test operation', okResult, 'success', 'warn')
    const logs = await loggerI.getLogs()
    expect(alignForSnap(logs)).toMatchInlineSnapshot(`" good test operation result was ok and returned : 42"`)
  })

  it('logger result D should log error result with custom levels', async () => {
    const loggerJ = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false }),
      errorResult = Result.error('custom error')
    loggerJ.result('test operation', errorResult, 'success', 'warn')
    const logs = await loggerJ.getLogs()
    expect(alignForSnap(logs)).toMatchInlineSnapshot(`" warn test operation result was error and returned : custom error"`)
  })

  it('logger showResult A should log ok result with default levels', async () => {
    const loggerK = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false }),
      okResult = Result.ok({ data: 'success' })
    loggerK.showResult('test operation', okResult)
    const logs = await loggerK.getLogs()
    expect(alignForSnap(logs)).toMatchInlineSnapshot(`" info test operation result was ok and returned : {'data':'success'}"`)
  })

  it('logger showResult B should log error result with default levels', async () => {
    const loggerL = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false }),
      errorResult = Result.error('something went wrong')
    loggerL.showResult('test operation', errorResult)
    const logs = await loggerL.getLogs()
    expect(alignForSnap(logs)).toMatchInlineSnapshot(`"error test operation result was error and returned : something went wrong"`)
  })

  it('logger showResult C should log ok result with custom levels', async () => {
    const loggerM = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false }),
      okResult = Result.ok(42)
    loggerM.showResult('test operation', okResult, 'success', 'warn')
    const logs = await loggerM.getLogs()
    expect(alignForSnap(logs)).toMatchInlineSnapshot(`" good test operation result was ok and returned : 42"`)
  })

  it('logger showResult D should log error result with custom levels', async () => {
    const loggerN = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false }),
      errorResult = Result.error('custom error')
    loggerN.showResult('test operation', errorResult, 'success', 'warn')
    const logs = await loggerN.getLogs()
    expect(alignForSnap(logs)).toMatchInlineSnapshot(`" warn test operation result was error and returned : custom error"`)
  })

  it('logger getLogs B should return empty array when no storage configured', async () => {
    const loggerO = new Logger({ willLogDelay: false, willOutputToConsole: false }),
      logs = await loggerO.getLogs()
    expect(logs).toMatchInlineSnapshot(`[]`)
  })

  it('logger clearLogs A should do nothing when no storage configured', async () => {
    const loggerP = new Logger({ willLogDelay: false, willOutputToConsole: false })
    await loggerP.clearLogs()
    const logs = await loggerP.getLogs()
    expect(logs).toMatchInlineSnapshot(`[]`)
  })

  it('logger clearLogs B should clear all logs from storage', async () => {
    const storage = createInMemoryDriver(),
      loggerQ = new Logger({ storage, willLogDelay: false, willOutputToConsole: false })
    loggerQ.info('log one')
    loggerQ.info('log two')
    const beforeClear = await loggerQ.getLogs()
    expect(beforeClear).toHaveLength(2)
    await loggerQ.clearLogs()
    const afterClear = await loggerQ.getLogs()
    expect(afterClear).toMatchInlineSnapshot(`[]`)
  })

  it('logger getLogs A should handle storage get failure gracefully', async () => {
    const badDriver = {
        delete: () => Promise.resolve(),
        get: () => Promise.reject(new Error('storage unavailable')),
        set: <Type>(_key: string, value: Type) => Promise.resolve(value),
      },
      loggerR = new Logger({ storage: badDriver, willLogDelay: false, willOutputToConsole: false }),
      logs = await loggerR.getLogs()
    expect(logs).toMatchInlineSnapshot(`[]`)
  })

  it('logger saveLog A should handle storage set failure gracefully', async () => {
    const badDriver = {
        delete: () => Promise.resolve(),
        get: <Type>() => Promise.resolve([] as unknown as Type),
        set: () => Promise.reject(new Error('write error')),
      },
      loggerS = new Logger({ storage: badDriver, willLogDelay: false, willOutputToConsole: false })
    loggerS.info('this will fail to save')
    const logs = await loggerS.getLogs()
    expect(logs).toMatchInlineSnapshot(`[]`)
  })

  it('logger saveLog should not drop logs when multiple log calls fire concurrently', async () => {
    const loggerU = new Logger({ storage: createInMemoryDriver(), willLogDelay: false, willOutputToConsole: false })
    // Fire 10 log calls synchronously — without the serial queue, last-write-wins drops all but one
    for (let index = 0; index < 10; index += 1) loggerU.info(`log ${index}`)

    const logs = await loggerU.getLogs()
    expect(logs).toHaveLength(10)
  })

  it('logger clearLogs C should handle storage delete failure gracefully', async () => {
    const badDriver = {
        delete: () => Promise.reject(new Error('delete error')),
        get: <Type>() => Promise.resolve([] as unknown as Type),
        set: <Type>(_key: string, value: Type) => Promise.resolve(value),
      },
      loggerT = new Logger({ storage: badDriver, willLogDelay: false, willOutputToConsole: false })
    await expect(loggerT.clearLogs()).resolves.toBeUndefined()
  })
})
