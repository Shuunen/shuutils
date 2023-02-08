#!/usr/bin/env node
import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import glob from 'tiny-glob'
import { blue } from './colors'
import { Nb } from './constants'
import { formatDate } from './dates'
import { injectMark, parseJson } from './strings'
import type { PackageJson } from './types'

/**
 * Log a message to the console
 * @param message the message to log
 * @param value the value to log
 */
function log (message: string, value = '') {
  console.log('unique-mark', blue(message), value)
}

/**
 * Load the package.json file data
 * @returns {string} the package.json version
 */
function getPackageJsonVersion () {
  const pkgLocation = path.join(process.cwd(), 'package.json')
  if (!existsSync(pkgLocation)) throw new Error(`package.json was not found in ${pkgLocation}, aborting.`)
  const content = readFileSync(pkgLocation, 'utf8')
  const { error, value } = parseJson<PackageJson>(content)
  if (error) throw new Error(`package.json in ${pkgLocation} is not a valid JSON, aborting.`)
  return value.version
}

/**
 * Get the files to inject the mark in
 */
async function getTargetFiles () {
  const hasTargetSpecified = process.argv.length === Nb.Three
  const defaultTarget = 'public/index.html'
  const target = (hasTargetSpecified && typeof process.argv[Nb.Third] === 'string') ? (process.argv[Nb.Third] ?? defaultTarget) : defaultTarget
  const files = await glob(target)
  if (files.length === 0) throw new Error(`no file found for target "${target}", aborting.`)
  return files
}

/**
 * Generate the mark to inject
 * @param root0 the options
 * @param root0.commit the commit hash to use, if empty, will use the last git commit hash
 * @param root0.date the date to use, if empty, will use the current date
 * @param root0.version the version to use, if empty, will use the version from package.json
 * @returns {string} the mark to inject, like "4.2.0 - 123abc45 - 01/01/2021 12:00:00"
 */
function generateMark ({ commit = '', date = formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss'), version = '' }) {
  let finalCommit = commit
  if (commit === '') finalCommit = execSync('git rev-parse --short HEAD', { cwd: process.cwd() }).toString().trim()
  return `${version} - ${finalCommit} - ${date}`
}


/**
 * Inject the mark in the files
 * @param root0 the options
 * @param root0.placeholder the placeholder to use to inject the mark
 * @param root0.mark the mark to inject
 * @param root0.files the files to inject the mark in
 * @returns {number} the total amount of mark injection in the targeted files
 */
function injectMarkInFiles ({ placeholder = 'unique-mark', mark = 'no-mark', files = [] }: { placeholder?: string; mark?: string; files?: string[] }) {
  let totalInjections = 0
  files.forEach(file => {
    const content = readFileSync(file, 'utf8')
    if (!content.includes(placeholder)) throw new Error(`could not find a place to inject in ${file}, aborting.\n\nPlease use one or more of these placeholders :  <span id="${placeholder}"></span>  <meta name="${placeholder}" content="">  __${placeholder}__`)
    const updatedContent = injectMark(content, placeholder, mark)
    // eslint-disable-next-line security/detect-non-literal-regexp, regexp/prefer-regexp-exec
    const times = (updatedContent.match(new RegExp(mark, 'gu')) ?? []).length
    writeFileSync(file, updatedContent)
    log(`injected in ${file}`, `${times} time${times > 1 ? 's' : ''}\n`)
    totalInjections += times
  })
  return totalInjections
}

/**
 * Main function
 */
async function init () {
  const isVerbose = process.argv.includes('-v') || process.argv.includes('--verbose')
  if (isVerbose) log('starting...')
  const version = getPackageJsonVersion()
  const files = await getTargetFiles()
  if (isVerbose) log(`found ${files.length} file${files.length > 1 ? 's' : ''} to inject mark`, files.join(', '))
  const mark = generateMark({ version })
  if (isVerbose) log('generated mark', mark)
  injectMarkInFiles({ mark, files })
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void init()
