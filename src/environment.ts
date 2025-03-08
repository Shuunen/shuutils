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
 * @returns true if the environment is a browser environment
 */
export function isBrowserEnvironment() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return globalThis.matchMedia !== undefined
}
