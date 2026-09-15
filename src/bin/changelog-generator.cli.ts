import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { parseJson } from '../lib/json'
import { Logger } from '../lib/logger'
import { Result } from '../lib/result'
import { stringify } from '../lib/string-stringify'

/* v8 ignore next */
const logger = new Logger({ minimumLevel: import.meta.main ? '3-info' : '7-error' }),
  commitRegex = /(?<ticket>\w+-\d+)[ :]+(?<type>\w+(?<scope>\([\w-]+\))?: ?)?(?<message>.+)/

/**
 * @param {string} commitLine single commit line to be parsed
 * @returns an object with {date, hash, message, ticket} or undefined depending on the retrievable information from the commit itself
 */
export function parseSingleCommit(commitLine: string) {
  const [hash, date, subject = ''] = commitLine.trim().split('|'),
    match = commitRegex.exec(subject)
  if (match?.groups) {
    const { ticket, message } = match.groups
    return { date, hash, message, ticket }
  }
  return undefined
}

/**
 * Read the git history and turn it into changelog entries
 * @param filters the commit prefixes to keep, all commits are kept if empty
 * @returns the matching history lines
 */
export function getHistory(filters: string[] = []) {
  const command = `git log --reverse --format="%h|%ad|%s" --date=short`,
    result = Result.trySafe(() => execSync(command, { encoding: 'utf8' }).trim()),
    { value: lines = '' } = Result.unwrap(result)
  return lines
    .split('\n')
    .map(commit => parseSingleCommit(commit))
    .filter(commit =>
      // oxlint-disable-next-line max-nested-callbacks
      filters.length > 0 ? filters.some(prefix => commit?.ticket?.startsWith(prefix)) : Boolean(commit),
    )
    .toReversed()
}

/**
 * Read the current release version from the local package.json
 * @returns the version, or an empty string if it could not be read
 */
export function getReleaseVersion() {
  const read = Result.trySafe(() => readFileSync('./package.json', 'utf8'))
  if (!read.ok) {
    logger.error(`Failed to read package.json : ${read.error}`)
    return 'failed to read package.json'
  }
  const json = parseJson<{ version?: string }>(read.value)
  if (!json.ok) {
    logger.error(`Failed to parse package.json : ${json.error}`)
    return 'failed to parse package.json'
  }
  return json.value.version ?? 'no version found'
}

/**
 * Extract the output path from the command line arguments
 * @param args the command line arguments
 * @returns the output path
 * @throws an Error if the --output argument is missing
 */
export function getOutput(args: string[] = process.argv) {
  const outputArg = args.find(arg => arg.startsWith('--output='))
  if (!outputArg) throw new Error('Usage: changelog-generator.cli.ts --output=<path>')

  return outputArg.slice('--output='.length)
}

/**
 * Extract the commit filters from the command line arguments
 * @param args the command line arguments
 * @returns the filters, or an empty list if the --filter argument is missing
 */
export function getFilters(args: string[] = process.argv) {
  const filterArg = args.find(arg => arg.startsWith('--filter='))
  if (!filterArg) return []

  return filterArg.slice('--filter='.length).split(',').filter(Boolean)
}

/**
 * Main entry point for the changelog-generator CLI
 * @returns a Result holding the generated changelog on success
 */
export function main() {
  logger.info('Generating changelog...')
  const output = getOutput(),
    filters = getFilters(),
    history = getHistory(filters),
    releaseVersion = getReleaseVersion(),
    data = { history, releaseVersion },
    fileContent = `export const generatedChangeLog = ${stringify(data, true)}`
  writeFileSync(output, fileContent)
  logger.info(`Changelog generated successfully at ${output}`)
}

/* v8 ignore start */
if (import.meta.main) main()
