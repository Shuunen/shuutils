/* eslint-disable @typescript-eslint/class-methods-use-this */
import { bgGreen, bgRed, blue, cyan, gray, green, red, yellow } from './colors'
import { formatDate, readableTime } from './dates'
import { isVerbose } from './flags'

type LogLevel = '1-debug' | '2-test' | '3-info' | '4-fix' | '5-warn' | '6-good' | '7-error'

export interface LoggerOptions {
  isActive: boolean
  minimumLevel: LogLevel
  willLogDate: boolean
  willLogDelay: boolean
  willLogTime: boolean
  willOutputToConsole: boolean
  willOutputToMemory: boolean
}

/**
 * Logger class
 * @example const logger = new Logger()
 * @example const logger = new Logger({ isActive: false, minimumLevel: '3-info', willLogDate: false, willLogDelay: true, willLogTime: false, willOutputToConsole: true, willOutputToMemory: false })
 */
// eslint-disable-next-line no-restricted-syntax
export class Logger {
  #lastLogTimestamp = 0

  readonly #levels: LogLevel[] = ['1-debug', '2-test', '3-info', '4-fix', '5-warn', '6-good', '7-error']

  readonly #padStart = 7

  readonly #padding: number

  public inMemoryLogs: string[] = []

  public options: LoggerOptions = {
    isActive: true,
    minimumLevel: /* c8 ignore next */ isVerbose() ? '1-debug' : '3-info',
    willLogDate: false,
    willLogDelay: true,
    willLogTime: false,
    willOutputToConsole: true,
    willOutputToMemory: false,
  }

  /**
   * Create a new Logger instance
   * @param options optional, LoggerOptions
   */
  public constructor(options?: Readonly<Partial<LoggerOptions>>) {
    if (options) this.options = { ...this.options, ...options }
    this.#padding = Math.max(...this.#levels.map(key => key.length - 2)) // eslint-disable-line @typescript-eslint/no-magic-numbers
  }

  /**
   * Calculate the delay since the last log
   * @returns the delay like "+12ms"
   */
  #getDelay() {
    const now = Date.now()
    if (this.#lastLogTimestamp === 0) {
      this.#lastLogTimestamp = now
      return gray('init'.padStart(this.#padStart))
    }
    const delay = now - this.#lastLogTimestamp
    this.#lastLogTimestamp = now
    return gray(`+${readableTime(delay, false)}`.padStart(this.#padStart))
  }

  /**
   * Log a message
   * @param prefix the prefix to add before the message
   * @param stuff the things to log
   */
  #log(prefix: string, stuff: Readonly<unknown[]>) {
    const prefixes = [prefix]
    if (this.options.willLogTime) prefixes.unshift(formatDate(new Date(), 'HH:mm:ss'))
    if (this.options.willLogDate) prefixes.unshift(formatDate(new Date(), 'yyyy-MM-dd'))
    if (this.options.willLogDelay) prefixes.unshift(this.#getDelay())
    if (this.options.willOutputToConsole)
      // biome-ignore lint/suspicious/noConsoleLog: it's ok
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log(prefixes.join(' '), ...stuff) // eslint-disable-line no-console
    if (this.options.willOutputToMemory) this.addToMemoryLogs(...prefixes, ...stuff)
  }

  /**
   * Log a message if log level allows it
   * @param prefix the prefix to add before the message
   * @param level the log level to check
   * @param stuff the things to log
   * @param color a function to colorize the prefix
   * @example logger.logIf('debug', '1-debug', ['Hello', 'world', 42])
   */
  // eslint-disable-next-line @typescript-eslint/max-params
  #logIf(prefix: string, level: LogLevel, stuff: Readonly<unknown[]>, color: (string_: string) => string) {
    if (!this.#shouldLog(level)) return
    this.#log(color(prefix.padStart(this.#padding)), stuff)
  }

  /**
   * Check if a log should be output
   * @param level the log level to check
   * @returns true if the log should be output
   */
  #shouldLog(level: LogLevel) {
    return this.options.isActive && this.#levels.indexOf(level) >= this.#levels.indexOf(this.options.minimumLevel)
  }

  /**
   * Push a log to the inMemoryLogs array
   * @param stuff the things to log
   * @example logger.addToMemoryLogs(['Hello', 'world', 42])
   */
  public addToMemoryLogs(...stuff: Readonly<unknown[]>) {
    this.inMemoryLogs.push(this.clean(...stuff))
  }

  /**
   * Log anything into a clean string-like line
   * @param stuff the things to log
   * @returns the cleaned log line
   * @example logger.clean(['Hello', { name: "world" }, 42]) // "Hello { "name": "world" } 42"
   */
  public clean(...stuff: Readonly<unknown[]>) {
    /* eslint-disable no-control-regex */
    return (
      stuff
        .map(thing => (typeof thing === 'object' ? JSON.stringify(thing) : String(thing)))
        .join(' ')
        // biome-ignore lint/suspicious/noControlCharactersInRegex: it's ok, daddy is here
        .replace(/[\u001B\u009B][#();?[]*(?:\d{1,4}(?:;\d{0,4})*)?[\d<=>A-ORZcf-nqry]/gu, '')
        .replace(/"/gu, "'")
    )
    /* eslint-enable no-control-regex */
  }

  /**
   * Log a debug message
   * @param stuff the things to log
   * @example logger.debug('Hello world')
   */
  public debug(...stuff: Readonly<unknown[]>) {
    this.#logIf('debug', '1-debug', stuff, gray)
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
    this.#logIf('error', '7-error', errors, red)
  }

  /**
   * Log a fix message
   * @param stuff the things to log
   * @example logger.fix('This is a fix')
   */
  public fix(...stuff: Readonly<unknown[]>) {
    this.#logIf('fix', '4-fix', stuff, cyan)
  }

  /**
   * Log a good message
   * @param stuff the things to log (will be green, as expected)
   * @example logger.good('Everything went well')
   */
  public good(...stuff: Readonly<unknown[]>) {
    this.#logIf('good', '6-good', stuff, green)
  }

  /**
   * Log an info message
   * @param stuff the things to log
   * @example logger.info('Hello ¯\_(ツ)_/¯')
   */
  public info(...stuff: Readonly<unknown[]>) {
    this.#logIf('info', '3-info', stuff, blue)
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
   * Log a truthy/falsy test assertion
   * @param thing the thing to test for truthiness
   * @param {...any} stuff the things to log
   * @example logger.test(1 === 1, '1 is equal to 1') // will log : ✔️ 1 is equal to 1
   */
  public test(thing: unknown, ...stuff: Readonly<unknown[]>) {
    if (!this.#shouldLog('2-test')) return
    const isTruthy = Boolean(thing)
    const box = isTruthy ? bgGreen(' ✓ ') : bgRed(' ✗ ')
    const prefix = ' '.repeat(this.#padding - 3) // eslint-disable-line @typescript-eslint/no-magic-numbers
    this.#log(prefix + box, stuff)
  }

  /**
   * Log a warn message
   * @param stuff the things to log
   * @example logger.warn('Something went wrong')
   */
  public warn(...stuff: Readonly<unknown[]>) {
    this.#logIf('warn', '5-warn', stuff, yellow)
  }
}
