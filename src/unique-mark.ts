#!/usr/bin/env node
import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import glob from 'tiny-glob'
import { blue, red } from './colors'
import { formatDate } from './dates'
import { injectMark, isJSON } from './strings'

new class UniqueMark {
  files: string[] = []
  name = 'unique-mark'
  mark = ''
  pkg: Record<string, unknown> = {}
  verbose = false

  /**
   * UniqueMark constructor
   */
  constructor () {
    this.init()
  }

  /**
   * Log a message to the console
   * @param message the message to log
   * @param value the value to log
   */
  log (message: string, value = ''): void {
    console.log(this.name, blue(message), value)
  }

  /**
   * Log an error to the console
   * @param message the message to log
   */
  error (message: string): void {
    console.error(this.name, red(message))
    process.exit(1)
  }

  /**
   * Main function
   */
  async init (): Promise<void> {
    this.verbose = process.argv.includes('-v') || process.argv.includes('--verbose')
    if (this.verbose) this.log('starting...')
    this.loadPackageJson()
    await this.getTargetFiles()
    if (this.files.length === 0) return
    this.generateMark()
    this.injectMark()
  }

  /**
   * Load the package.json file data
   * @returns {void}
   */
  loadPackageJson (): void {
    if (this.verbose) this.log('looking for', 'package.json')
    const pkgLocation = path.join(process.cwd(), 'package.json')
    if (!existsSync(pkgLocation)) return this.error(`package.json was not found in ${pkgLocation}, aborting ${this.name}.`)
    const content = readFileSync(pkgLocation, 'utf8')
    if (!isJSON(content)) return this.error(`package.json in ${pkgLocation} is not a valid JSON, aborting ${this.name}.`)
    this.pkg = JSON.parse(content)
  }

  /**
   * Get the files to inject the mark in
   */
  async getTargetFiles (): Promise<void> {
    const targetSpecified = process.argv.length === 3
    const target = (targetSpecified && typeof process.argv[2] === 'string') ? process.argv[2] : 'public/index.html'
    this.files = await glob(target)
    if (this.files.length === 0) return this.error(`no file found for target "${target}", aborting ${this.name}.`)
    if (this.verbose) this.log(`found ${this.files.length} file${this.files.length > 1 ? 's' : ''} to inject mark`, this.files.join(', '))
  }

  /**
   * Generate the mark to inject
   */
  generateMark (): void {
    try {
      const lastCommit = execSync('git rev-parse --short HEAD', { cwd: process.cwd() }).toString().trim()
      const now = formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss')
      this.mark = `${this.pkg['version']} - ${lastCommit} - ${now}`
      if (this.verbose) this.log('generated mark', this.mark)
    } catch (error) {
      this.error(`could not generate mark, cause "${(error as Error).message}", aborting`)
    }
  }

  /**
   * Inject the mark in the files
   */
  injectMark (): void {
    this.files.forEach(file => {
      const content = readFileSync(file, 'utf8')
      if (!content.includes(`="${this.name}"`) && !content.includes(`__${this.name}__`)) return this.error(`could not find a place to inject in ${file}, aborting ${this.name}.\n\nPlease use one or more of these placeholders :  <span id="${this.name}"></span>  <meta name="${this.name}" content="">  __unique-mark__`)
      const newContent = injectMark(content, this.name, this.mark)
      const times = (newContent.match(new RegExp(this.mark, 'g')) || []).length
      writeFileSync(file, newContent)
      this.log(`injected in ${file}`, `${times} time${times > 1 ? 's' : ''}\n`)
    })
  }
}()
