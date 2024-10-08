/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { sleep } from './functions'
import { Logger } from './logger'

type AnalyticsInstance = {
  identify: (userId: string, additionalData?: Record<string, unknown>) => Promise<void>
  page: () => Promise<void>
  track: (event: string, additionalData?: Record<string, unknown>) => Promise<void>
}

/**
 * Generic analytics wrapper, can be used with any analytics third party library
 * @example const analytics = new Analytics()
 * @example analytics.setupInMemory('my-app')
 * @example analytics.track('invoice-download')
 * @example analytics.track('click', { category: '...', label: '...', ... })
 */
// eslint-disable-next-line no-restricted-syntax
export class Analytics {
  private $app = ''
  private $instance: AnalyticsInstance | undefined = undefined
  private readonly $logger = new Logger()
  public readonly pile: string[] = []

  /**
   * Identify a user
   * @param userId - The user, like '123456', 'super-admin', etc.
   * @param additionalData - Additional data to identify the user, like `{ email: '...', age: 35, ... }`
   */
  public identify(userId: string, additionalData?: Record<string, unknown>) {
    if (this.$instance === undefined) throw new Error('analytics : identify failed, analytics not setup')
    this.$logger.info(`analytics : identify user "${userId}" on app "${this.$app}"`)
    void this.$instance.identify(userId, additionalData)
  }

  /**
   * Track a page view
   */
  public page() {
    if (this.$instance === undefined) throw new Error('analytics : track page failed, analytics not setup')
    this.$logger.debug(`analytics : track page for app "${this.$app}"`)
    void this.$instance.page()
  }

  /**
   * Setup analytics with in memory tracking, useful for tests
   * @param app - The name of the app, like 'mlm-react-front', 'cosmos-front', etc.
   */
  public setupInMemory(app: string) {
    this.$app = app
    // eslint-disable-next-line jsdoc/require-jsdoc
    const addToPile = async (item: string, data?: Record<string, unknown>) => {
      this.$logger.debug(`analytics : add "${item}" to pile`, data)
      await sleep(1)
      this.pile.push(item)
      this.$logger.debug(`analytics : pile for app "${app}"`, this.pile)
    }
    this.$instance = {
      // eslint-disable-next-line jsdoc/require-jsdoc
      identify: async (userId: string, additionalData?: Record<string, unknown>) => {
        await addToPile(`identify:${userId}`, additionalData)
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      page: async () => {
        await addToPile('page')
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      track: async (event: string, additionalData?: Record<string, unknown>) => {
        await addToPile(`track:${event}`, additionalData)
      },
    }
    this.$logger.info(`analytics : setup app "${app}" with in memory tracking`)
  }

  /**
   * Track an event
   * @param event - The event name like 'click', 'download-invoice', etc.
   * @param additionalData - Additional data to track the event, like `{ category: '...', label: '...', ... }`
   */
  public track(event: string, additionalData?: Record<string, unknown>) {
    if (this.$instance === undefined) throw new Error('analytics : track event failed, analytics not setup')
    this.$logger.debug(`analytics : track event "${event}" for app "${this.$app}"`)
    void this.$instance.track(event, additionalData)
  }
}
