import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { formatDate } from '../lib/date-format.ts'
import { parseJson } from '../lib/json.ts'
import { Result } from '../lib/result.ts'
import type { PackageJson } from '../lib/types.ts'

/**
 * The files the unique mark goes in, other files like images, fonts or wasm would be corrupted when read and written as text
 */
export const markableRegex = /\.(?:c|m)?js$|\.css$|\.html$/u

/**
 * Load package.json file data
 * @param location the location of the package.json file
 * @returns the package.json version
 */
export function getPackageJsonVersion(location = path.join(process.cwd(), 'package.json')) {
  if (!existsSync(location)) return Result.error(`package.json was not found in ${location}, aborting.`)

  const content = readFileSync(location, 'utf8')
  const parsed = parseJson<PackageJson>(content)
  if (!parsed.ok) return Result.error(`package.json in ${location} is not a valid JSON, aborting.`)
  // a private app package.json often has no version, and a json like "null" has no fields at all
  const version: unknown = parsed.value?.version
  if (typeof version !== 'string') return Result.error(`package.json in ${location} has no version, aborting.`)

  return Result.ok(version)
}

/**
 * The commit put in the mark when git or the repository is not available
 */
export const noGitCommit = 'no-git-commit'

/**
 * Get the short hash of the last git commit
 * @param cwd the directory to run git in
 * @returns the short commit hash, or "no-git-commit" when git or the repository is not available
 */
export function getGitCommit(cwd = process.cwd()) {
  try {
    return execSync('git rev-parse --short HEAD', { cwd, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return noGitCommit
  }
}

/**
 * Generate the mark to inject
 * @param options the options
 * @param options.commit the commit hash to use, if empty, will use the last git commit hash
 * @param options.date the date to use, if empty, will use the current date
 * @param options.version the version to use, like the one from package.json
 * @returns the mark to inject, like "4.2.0 - 123abc45 - 01/01/2021 12:00:00"
 */
export function generateMark({ commit = '', date = formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss'), version = '' }: Readonly<{ commit?: string; date?: string; version?: string }>) {
  const finalCommit = commit === '' ? getGitCommit() : commit
  return `${version} - ${finalCommit} - ${date}`
}
