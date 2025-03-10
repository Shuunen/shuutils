/**
 * Check if the given option is present in the command line arguments
 * @param name the name of the option to check
 * @returns true if the option is present, false otherwise
 */
export function hasOption(name: string) {
  // could be nice to check for environment variables too
  if (typeof process === 'undefined') return false
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (process.argv ?? []).includes(`--${name}`) || (process.env?.[name] ?? '').toString() === 'true'
}

/**
 * For debugging purposes, print out the verbose output
 * @returns true if the verbose option is present
 */
export function isVerbose() {
  return hasOption('v') || hasOption('verbose') || hasOption('VERBOSE') || hasOption('debug') || hasOption('DEBUG')
}
