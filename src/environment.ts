/**
 * Check if the environment is a test environment
 * @returns true if the environment is a test environment
 */
export function isTestEnvironment() {
  return process.env.NODE_ENV === 'test'
}
