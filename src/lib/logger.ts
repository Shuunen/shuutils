import type { AsyncStorage } from './async-storage'
import { consoleLog } from './browser-console'
import { toastError, toastInfo, toastSuccess } from './browser-toast'
import { bgGreen, bgRed, blue, cyan, gray, green, red, yellow } from './colors'
import { nbFourth, nbSpacesIndent } from './constants'
import { formatDate } from './date-format'
import { readableTime } from './date-readable-time'
import { isBrowserEnvironment } from './environment'
import { isVerbose } from './flags'
// oxlint-disable max-lines
import { isObjectEmpty } from './object-is-empty'
import { type ResultType, Result } from './result'
import { stringify } from './string-stringify'

const logsStorageKey = 'logs'

/**
 * Clean stuff to log
 * @param stuff the things to log
 * @returns the cleaned log line
 * @example clean(['Hello', { name: "world" }, 42]) // "Hello { "name": "world" } 42"
 */
function clean(...stuff: Readonly<unknown[]>) {
  // ANSI escape sequence regex - using String.fromCharCode to avoid linter complaints
  const ansiEscapeRegex = new RegExp(
    // oxlint-disable-next-line no-magic-numbers
    `[${String.fromCodePoint(0x1b)}${String.fromCodePoint(0x9b)}][#();?[]*(?:\\d{1,4}(?:;\\d{0,4})*)?[\\d<=>A-ORZcf-nqry]`,
    'gu',
  )
  return stuff
    .map(thing => stringify(thing))
    .join(' ')
    .replaceAll(ansiEscapeRegex, '')
    .replaceAll('"', "'")
    .trim()
}

type LogLevel = '1-debug' | '2-test' | '3-info' | '4-fix' | '5-warn' | '6-good' | '7-error'

export type LoggerOptions = {
  /**
   * If the logger is active, when false, no logs will be output
   * @default true
   */
  isActive: boolean
  /**
   * The minimum log level to output
   * @default '3-info' or '1-debug' if verbose mode is active
   */
  minimumLevel: LogLevel
  /**
   * Will log the date in the format yyyy-MM-dd, example "2023-10-01"
   * @default false
   */
  willLogDate: boolean
  /**
   * Will log the delay since the last log, example "+12ms"
   * @default true
   */
  willLogDelay: boolean
  /**
   * Will log the time in the format "HH:mm:ss", example "12:34:56"
   * @default false
   */
  willLogTime: boolean
  /**
   * Will output the logs to the global console instance
   * @default true
   */
  willOutputToConsole: boolean
  /**
   * The AsyncStorage instance to use to store the logs, example localStorageDriver, etc.
   */
  storage?: AsyncStorage
}

/**
 * Logger class
 * @example const logger = new Logger()
 * @example const logger = new Logger({ isActive: false, minimumLevel: '3-info', willLogDate: false, willLogDelay: true, willLogTime: false, willOutputToConsole: true, storage: createInMemoryDriver() })
 */
export class Logger {
  #lastLogTimestamp = 0

  #saveQueue: Promise<void> = Promise.resolve()

  readonly #levels: LogLevel[] = ['1-debug', '2-test', '3-info', '4-fix', '5-warn', '6-good', '7-error']

  readonly #padding: number

  readonly #padStart = 7

  public clean = clean

  #context: Record<string, unknown> = {}

  public options: LoggerOptions = {
    isActive: true,
    /* v8 ignore start */
    minimumLevel: isVerbose() ? '1-debug' : '3-info',
    /* v8 ignore stop */
    willLogDate: false,
    willLogDelay: true,
    willLogTime: false,
    willOutputToConsole: true,
  }

  /**
   * Create a new Logger instance
   * @param options optional, LoggerOptions
   */
  public constructor(options?: Readonly<Partial<LoggerOptions>>) {
    if (options) this.options = { ...this.options, ...options }

    this.#padding = Math.max(...this.#levels.map(key => key.length - nbSpacesIndent))
  }

  /**
   * Calculate the delay since the last log
   * @returns the delay like "+12ms"
   */
  private __getDelay() {
    const now = Date.now()
    if (this.#lastLogTimestamp === 0) {
      this.#lastLogTimestamp = now
      return 'init'.padStart(this.#padStart)
    }
    const delay = now - this.#lastLogTimestamp
    this.#lastLogTimestamp = now
    return `+${readableTime(delay, false)}`.padStart(this.#padStart)
  }

  private saveLog(line: string) {
    // oxlint-disable-next-line promise/prefer-await-to-then -- serial queue requires .then() chaining
    this.#saveQueue = this.#saveQueue.then(() => this.__doSaveLog(line))
  }

  private async __doSaveLog(line: string) {
    if (!this.options.storage) return

    const logs = await this.__getLogsFromStorage()
    logs.push(line)
    const setResult = await Result.trySafe(this.options.storage.set(logsStorageKey, logs))
    if (!setResult.ok) this.__log(['error'], ['Failed to set logs to storage', setResult.error])
  }

  private async __getLogsFromStorage() {
    if (!this.options.storage) return []

    const getResult = await Result.trySafe(this.options.storage.get<string[]>(logsStorageKey))
    if (!getResult.ok) {
      this.__log(['error'], ['Failed to get logs from storage', getResult.error])
      return []
    }
    return getResult.value ?? []
  }

  public async getLogs() {
    await this.#saveQueue
    return this.__getLogsFromStorage()
  }

  public async clearLogs() {
    if (!this.options.storage) return

    await this.#saveQueue
    const deleteResult = await Result.trySafe(this.options.storage.delete(logsStorageKey))
    if (!deleteResult.ok) this.__log(['error'], ['Failed to clear logs from storage', deleteResult.error])
  }

  /**
   * Log a message
   * @param prefixes the prefixes to add before the message
   * @param stuff the things to log
   */
  private __log(prefixes: string[], stuff: Readonly<unknown[]>) {
    if (this.options.willOutputToConsole) consoleLog(prefixes.join(' '), ...stuff)
  }

  /**
   * Log a message if log level allows it
   * @param prefix the prefix to add before the message
   * @param level the log level to check
   * @param stuff the things to log
   * @param color a function to colorize the prefix
   * @example logger.logIf('debug', '1-debug', ['Hello', 'world', 42])
   */
  // oxlint-disable-next-line max-params
  private __logIf(prefix: string, level: LogLevel, stuff: Readonly<unknown[]>, color: (string_: string) => string) {
    const prefixes = [prefix.padStart(this.#padding)]
    if (this.options.willLogTime) prefixes.unshift(formatDate(new Date(), 'HH:mm:ss'))

    if (this.options.willLogDate) prefixes.unshift(formatDate(new Date(), 'yyyy-MM-dd'))

    if (this.options.willLogDelay) prefixes.unshift(this.__getDelay())

    const context = isObjectEmpty(this.#context) ? '' : { context: this.#context },
      line = `${prefixes.join(' ')} ${clean(...stuff, context)}`
    this.saveLog(line)
    if (!this.__shouldLog(level)) return

    /* v8 ignore next */
    prefixes[prefixes.length - 1] = color(prefixes.at(-1) ?? '')
    this.__log(prefixes, stuff)
  }

  /**
   * Check if a log should be output
   * @param level the log level to check
   * @returns true if the log should be output
   */
  private __shouldLog(level: LogLevel) {
    return this.options.isActive && this.#levels.indexOf(level) >= this.#levels.indexOf(this.options.minimumLevel)
  }

  /**
   * Log a debug message
   * @param stuff the things to log
   * @example logger.debug('Hello world')
   */
  public debug(...stuff: Readonly<unknown[]>) {
    this.__logIf('debug', '1-debug', stuff, gray)
  }

  /**
   * Disable the logger output
   */
  public disable() {
    this.options.isActive = false
  }

  /**
   * Enable the logger output
   */
  public enable() {
    this.options.isActive = true
  }

  /**
   * Log an error message
   * @param stuff the things to log (will be red, such original)
   * @example logger.error('Something went wrong')
   */
  public error(...stuff: Readonly<unknown[]>) {
    const errors = stuff.map(thing => (thing instanceof Error ? thing.message : thing))
    this.__logIf('error', '7-error', errors, red)
  }

  /**
   * Log a fix message
   * @param stuff the things to log
   * @example logger.fix('This is a fix')
   */
  public fix(...stuff: Readonly<unknown[]>) {
    this.__logIf('fix', '4-fix', stuff, cyan)
  }

  /**
   * Log a good message
   * @param stuff the things to log (will be green, as expected)
   * @example logger.good('Everything went well')
   */
  public good(...stuff: Readonly<unknown[]>) {
    this.__logIf('good', '6-good', stuff, green)
  }

  /**
   * Log an info message
   * @param stuff the things to log
   * @example logger.info('Hello ¯\_(ツ)_/¯')
   */
  public info(...stuff: Readonly<unknown[]>) {
    this.__logIf('info', '3-info', stuff, blue)
  }

  /**
   * Log an error message and show a toast
   * @param stuff the things to log (will be red, such original)
   * @example logger.error('Something went wrong')
   */
  public showError(...stuff: Readonly<unknown[]>) {
    this.error(...stuff)
    /* v8 ignore start */
    if (isBrowserEnvironment()) toastError(clean(...stuff))

    /* v8 ignore stop */
  }

  /**
   * Log an info message and show a toast
   * @param stuff the things to log
   * @example logger.info('Hello ¯\_(ツ)_/¯')
   */
  public showInfo(...stuff: Readonly<unknown[]>) {
    this.info(...stuff)
    /* v8 ignore start */
    if (isBrowserEnvironment()) toastInfo(clean(...stuff))

    /* v8 ignore stop */
  }

  /**
   * Log a success message and show a toast
   * @param stuff the things to log
   * @example logger.success('Everything went well')
   */
  public showSuccess(...stuff: Readonly<unknown[]>) {
    this.success(...stuff)
    /* v8 ignore start */
    if (isBrowserEnvironment()) toastSuccess(clean(...stuff))

    /* v8 ignore stop */
  }

  /**
   * Log a success message
   * @param stuff the things to log (will be green, as expected)
   * @example logger.success('Everything went well')
   * @alias good
   */
  public success(...stuff: Readonly<unknown[]>) {
    this.good(...stuff)
  }

  /**
   * Log a Result with appropriate levels
   * @param message the common message to log before the Result
   * @param result the Result to log
   * @param okLevel the log level to use if the Result is ok, default is 'info'
   * @param errorLevel the log level to use if the Result is error, default is 'error'
   * @example logger.result("update operation", result)
   * @example logger.result("another operation", result, 'success', 'warn')
   */
  // oxlint-disable-next-line max-params
  public result(message: string, result: ResultType<unknown, unknown>, okLevel: 'info' | 'success' = 'info', errorLevel: 'error' | 'warn' = 'error') {
    if (result.ok) this[okLevel](message, 'result was ok and returned :', result.value)
    else this[errorLevel](message, 'result was error and returned :', result.error)
  }

  /**
   * Log a Result with appropriate levels and show a toast
   * @param message the common message to log before the Result
   * @param result the Result to log
   * @param okLevel the log level to use if the Result is ok, default is 'info'
   * @param errorLevel the log level to use if the Result is error, default is 'error'
   * @example logger.showResult("update operation", result)
   * @example logger.showResult("another operation", result, 'success', 'warn')
   */
  // oxlint-disable-next-line max-params
  public showResult(message: string, result: ResultType<unknown, unknown>, okLevel: 'info' | 'success' = 'info', errorLevel: 'error' | 'warn' = 'error') {
    this.result(message, result, okLevel, errorLevel)
    /* v8 ignore start */
    if (isBrowserEnvironment()) {
      const isOk = result.ok,
        level = isOk ? okLevel : errorLevel,
        toastMethods = { error: toastError, info: toastInfo, success: toastSuccess, warn: toastInfo },
        showMethod = toastMethods[level]
      showMethod(`${message}: ${clean(isOk ? result.value : result.error)}`)
    }
    /* v8 ignore stop */
  }

  /**
   * Log a truthy/falsy test assertion
   * @param thing the thing to test for truthiness
   * @param stuff the things to log
   * @example logger.test(1 === 1, '1 is equal to 1') // will log : ✔️ 1 is equal to 1
   */
  public test(thing: unknown, ...stuff: Readonly<unknown[]>) {
    const isTruthy = Boolean(thing),
      box = isTruthy ? bgGreen(' ✓ ') : bgRed(' ✗ '),
      prefix = ' '.repeat(this.#padding - nbFourth)
    this.__logIf(prefix + box, '2-test', stuff, isTruthy ? green : red)
  }

  /**
   * Log a warn message
   * @param stuff the things to log
   * @example logger.warn('Something went wrong')
   */
  public warn(...stuff: Readonly<unknown[]>) {
    this.__logIf('warn', '5-warn', stuff, yellow)
  }

  /**
   * Set the context for the logger that will be happened at the end of the log line
   * @param context the context to set
   * @example logger.setContext({ user: { id: 1, name: "John Doe" } })
   */
  public setContext(context: Record<string, unknown>) {
    this.#context = { ...this.#context, ...context }
  }

  /**
   * Clear the context of the logger
   * @example logger.clearContext()
   */
  public clearContext() {
    this.#context = {}
  }
}
