
import { bgGreen, bgRed, blue, gray, green, red, yellow } from './colors'
import { formatDate, readableTime } from './dates'

type LogLevel = '1-debug' | '2-test' | '3-info' | '4-warn' | '5-good' | '6-error'

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
 */
export class Logger {

  public options: LoggerOptions = {
    isActive: true,
    minimumLevel: '1-debug',
    willLogDate: false,
    willLogDelay: true,
    willLogTime: false,
    willOutputToConsole: true,
    willOutputToMemory: false,
  }

  public inMemoryLogs: string[] = []

  private readonly padding: number

  private readonly levels: LogLevel[] = [
    '1-debug',
    '2-test',
    '3-info',
    '4-warn',
    '5-good',
    '6-error',
  ]

  private lastLogTimestamp = 0

  private readonly padStart = 7

  /**
   * Create a new Logger instance
   * @param options optional, LoggerOptions
   */
  public constructor (options?: Partial<LoggerOptions>) {
    if (options) this.options = { ...this.options, ...options }
    this.padding = Math.max(...this.levels.map((key) => key.length - 2)) // eslint-disable-line @typescript-eslint/no-magic-numbers
  }

  /**
   * Calculate the delay since the last log
   * @returns the delay like "+12ms"
   */
  private getDelay () {
    const now = Date.now()
    if (this.lastLogTimestamp === 0) {
      this.lastLogTimestamp = now
      return gray('init'.padStart(this.padStart))
    }
    const delay = now - this.lastLogTimestamp
    this.lastLogTimestamp = now
    return gray(`+${readableTime(delay, false)}`.padStart(this.padStart))
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
    if (this.options.willOutputToConsole) console.log(prefixes.join(' '), ...stuff) // eslint-disable-line no-console
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
    if (!this.shouldLog('1-debug')) return
    this.log('debug'.padStart(this.padding), stuff)
  }

  /**
   * Log an info message
   * @param stuff the things to log
   * @example logger.info('Hello ¯\_(ツ)_/¯')
   */
  public info (...stuff: unknown[]) {
    if (!this.shouldLog('3-info')) return
    this.log(blue('info'.padStart(this.padding)), stuff)
  }

  /**
   * Log a warn message
   * @param stuff the things to log
   * @example logger.warn('Something went wrong')
   */
  public warn (...stuff: unknown[]) {
    if (!this.shouldLog('4-warn')) return
    this.log(yellow('warn'.padStart(this.padding)), stuff)
  }

  /**
   * Log a good message
   * @param stuff the things to log (will be green, as expected)
   * @example logger.good('Everything went well')
   */
  public good (...stuff: unknown[]) {
    if (!this.shouldLog('5-good')) return
    this.log(green('good'.padStart(this.padding)), stuff)
  }

  /**
   * Log a success message
   * @param stuff the things to log (will be green, as expected)
   * @example logger.success('Everything went well')
   * @alias good
   */
  public success (...stuff: unknown[]) {
    this.good(...stuff)
  }

  /**
   * Log an error message
   * @param stuff the things to log (will be red, such original)
   * @example logger.error('Something went wrong')
   */
  public error (...stuff: unknown[]) {
    if (!this.shouldLog('6-error')) return
    this.log(red('error'.padStart(this.padding)), stuff)
  }

  /**
   * Log a truthy/falsy test assertion
   * @param thing the thing to test for truthiness
   * @param {...any} stuff the things to log
   * @example logger.test(1 === 1, '1 is equal to 1') // will log : ✔️ 1 is equal to 1
   */
  public test (thing: unknown, ...stuff: unknown[]) {
    if (!this.shouldLog('2-test')) return
    const isTruthy = Boolean(thing)
    const box = isTruthy ? bgGreen(' ✓ ') : bgRed(' ✗ ')
    const prefix = ' '.repeat(this.padding - 3) // eslint-disable-line @typescript-eslint/no-magic-numbers
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

