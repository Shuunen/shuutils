/**
 * Check if the environment is a test environment
 * @returns true if the environment is a test environment
 */
export function isTestEnvironment() {
  const properties = ['jest', 'mocha', '__vitest_environment__', '__vitest_required__']
  const hasTestBin = properties.some(property => property in globalThis)
  if (hasTestBin) return true
  const useBunTest = 'Bun' in globalThis && globalThis.Bun.argv.join(' ').includes('.test.')
  return useBunTest
}

/**
 * Check if the environment is a browser environment
 * @param userAgent optional, the user agent to check, default is navigator.userAgent
 * @returns true if the environment is a browser environment
 */
export function isBrowserEnvironment(userAgent = globalThis.navigator.userAgent) {
  const isHappyDom = userAgent.includes('HappyDOM')
  if (isHappyDom) return false
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return typeof document !== 'undefined' && globalThis.matchMedia !== undefined
}
