
import { bgGreen, bgRed, blue, gray, green, red, yellow } from './colors'
import { Nb } from './constants'
import { formatDate, readableTime } from './dates'

export const enum LogLevel {
  Debug = 'debug',
  Test = 'test',
  Info = 'info',
  Warn = 'warn',
  Success = 'good',
  Error = 'error', // eslint-disable-line @typescript-eslint/no-shadow
}

export interface LoggerOptions {
  isActive: boolean
  minimumLevel: LogLevel
  willOutputToConsole: boolean
  willOutputToMemory: boolean
  willLogDate: boolean
  willLogTime: boolean
  willLogDelay: boolean
}

/**
 * Logger class
 */
export class Logger {

  public options: LoggerOptions = {
    isActive: true,
    minimumLevel: LogLevel.Debug,
    willOutputToConsole: true,
    willOutputToMemory: false,
    willLogDate: false,
    willLogTime: false,
    willLogDelay: true,
  }

  public inMemoryLogs: string[] = []

  private readonly padding: number

  private readonly levels: LogLevel[] = [
    LogLevel.Debug,
    LogLevel.Test,
    LogLevel.Info,
    LogLevel.Warn,
    LogLevel.Success,
    LogLevel.Error,
  ]

  private lastLogTimestamp = 0

  /**
   * Create a new Logger instance
   * @param options optional, LoggerOptions
   */
  public constructor (options?: Partial<LoggerOptions>) {
    if (options) this.options = { ...this.options, ...options }
    this.padding = Math.max(...this.levels.map((key) => key.length))
  }

  /**
   * Calculate the delay since the last log
   * @returns the delay like "+12ms"
   */
  private getDelay () {
    const now = Date.now()
    if (this.lastLogTimestamp === 0) {
      this.lastLogTimestamp = now
      return gray('init'.padStart(Nb.Seven))
    }
    const delay = now - this.lastLogTimestamp
    this.lastLogTimestamp = now
    return gray(`+${readableTime(delay, false)}`.padStart(Nb.Seven))
  }

  /**
   * Clean a log line
   * @param stuff the things to log
   * @returns the cleaned log line
   * @example logger.stuffToCleanLine(['Hello', 'world', 42]) // "Hello world 42"
   */
  public clean (...stuff: unknown[]) {
    return stuff
      .map(thing => typeof thing === 'object' ? JSON.stringify(thing) : String(thing))
      .join(' ')
      // eslint-disable-next-line security/detect-unsafe-regex, unicorn/no-unsafe-regex, no-control-regex, regexp/no-control-character
      .replace(/[\u001B\u009B][#();?[]*(?:\d{1,4}(?:;\d{0,4})*)?[\d<=>A-ORZcf-nqry]/gu, '')
      .replace(/"/gu, '\'')
  }

  /**
   * Push a log to the inMemoryLogs array
   * @param stuff the things to log
   * @example logger.addToMemoryLogs(['Hello', 'world', 42])
   */
  public addToMemoryLogs (...stuff: unknown[]) {
    this.inMemoryLogs.push(this.clean(...stuff))
  }

  /**
   * Log a message
   * @param prefix the prefix to add before the message
   * @param stuff the things to log
   */
  private log (prefix: string, stuff: unknown[]) {
    const prefixes = [prefix]
    if (this.options.willLogTime) prefixes.unshift(formatDate(new Date(), 'HH:mm:ss'))
    if (this.options.willLogDate) prefixes.unshift(formatDate(new Date(), 'yyyy-MM-dd'))
    if (this.options.willLogDelay) prefixes.unshift(this.getDelay())
    if (this.options.willOutputToConsole) console.log(prefixes.join(' '), ...stuff)
    if (this.options.willOutputToMemory) this.addToMemoryLogs(...prefixes, ...stuff)
  }

  /**
   * Check if a log should be output
   * @param level the log level to check
   * @returns true if the log should be output
   */
  private shouldLog (level: LogLevel) {
    return this.options.isActive && this.levels.indexOf(level) >= this.levels.indexOf(this.options.minimumLevel)
  }

  /**
   * Log a debug message
   * @param stuff the things to log
   * @example logger.debug('Hello world')
   */
  public debug (...stuff: unknown[]) {
    if (!this.shouldLog(LogLevel.Debug)) return
    this.log(LogLevel.Debug.padStart(this.padding), stuff)
  }

  /**
   * Log an info message
   * @param stuff the things to log
   * @example logger.info('Hello ¯\_(ツ)_/¯')
   */
  public info (...stuff: unknown[]) {
    if (!this.shouldLog(LogLevel.Info)) return
    this.log(blue(LogLevel.Info.padStart(this.padding)), stuff)
  }

  /**
   * Log a warn message
   * @param stuff the things to log
   * @example logger.warn('Something went wrong')
   */
  public warn (...stuff: unknown[]) {
    if (!this.shouldLog(LogLevel.Warn)) return
    this.log(yellow(LogLevel.Warn.padStart(this.padding)), stuff)
  }

  /**
   * Log a success message
   * @param stuff the things to log (will be green, as expected)
   * @example logger.success('Everything went well')
   */
  public success (...stuff: unknown[]) {
    if (!this.shouldLog(LogLevel.Success)) return
    this.log(green(LogLevel.Success.padStart(this.padding)), stuff)
  }

  /**
   * Log an error message
   * @param stuff the things to log (will be red, such original)
   * @example logger.error('Something went wrong')
   */
  public error (...stuff: unknown[]) {
    if (!this.shouldLog(LogLevel.Error)) return
    this.log(red(LogLevel.Error.padStart(this.padding)), stuff)
  }

  /**
   * Log a truthy/falsy test assertion
   * @param thing the thing to test for truthiness
   * @param {...any} stuff the things to log
   * @example logger.test(1 === 1, '1 is equal to 1') // will log : ✔️ 1 is equal to 1
   */
  public test (thing: unknown, ...stuff: unknown[]) {
    if (!this.shouldLog(LogLevel.Test)) return
    const isTruthy = Boolean(thing)
    const box = isTruthy ? bgGreen(' ✓ ') : bgRed(' ✗ ')
    const prefix = ' '.repeat(this.padding - Nb.Three)
    this.log(prefix + box, stuff)
  }

  /**
   * Enable the logger output
   */
  public enable () {
    this.options.isActive = true
  }

  /**
   * Disable the logger output
   */
  public disable () {
    this.options.isActive = false
  }
}

