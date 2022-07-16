import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import glob from 'tiny-glob'
import { blue, red } from './colors'
import { isJSON } from './strings'

new class UniqueMark {
  files: string[] = []
  name = 'unique-mark'
  mark = ''
  pkg: Record<string, unknown> = {}

  constructor () {
    this.init()
  }
  log (message: string, value = '') {
    console.log(this.name, blue(message), value)
  }
  error (message: string) {
    console.error(this.name, red(message))
    process.exit(1)
  }
  async init () {
    this.log('starting...')
    this.loadPackageJson()
    await this.getTargetFiles()
    if (this.files.length === 0) return
    this.generateMark()
    this.injectMark()
  }
  loadPackageJson () {
    this.log('looking for', 'package.json')
    const pkgLocation = path.join(process.cwd(), 'package.json')
    if (!existsSync(pkgLocation)) return this.error(`package.json was not found in ${pkgLocation}, aborting ${this.name}.`)
    const content = readFileSync(pkgLocation, 'utf8')
    if (!isJSON(content)) return this.error(`package.json in ${pkgLocation} is not a valid JSON, aborting ${this.name}.`)
    this.pkg = JSON.parse(content)
  }
  async getTargetFiles () {
    const targetSpecified = process.argv.length === 3
    const target = targetSpecified ? process.argv[2] : 'public/index.html'
    this.files = await glob(target)
    if (this.files.length === 0) return this.error(`no file found for target "${target}", aborting ${this.name}.`)
    this.log(`found ${this.files.length} file${this.files.length > 1 ? 's' : ''} to inject mark`, this.files.join(', '))
  }
  generateMark () {
    try {
      const lastCommit = execSync('git rev-parse --short HEAD', { cwd: process.cwd() }).toString().trim()
      const now = (new Date().toISOString()).split('.')[0].replace('T', ' ')
      this.mark = `${this.pkg.version} - ${lastCommit} - ${now}`
      this.log('generated mark', this.mark)
    } catch (error) {
      this.error(`could not generate mark, cause "${(error as Error).message}", aborting`)
    }
  }
  injectMark () {
    this.files.forEach(file => {
      const content = readFileSync(file, 'utf8')
      if (!content.includes(`="${this.name}"`) && !content.includes(`__${this.name}__`)) return this.error(`could not find a place to inject in ${location}, aborting ${this.name}.\n\nPlease use one or more of these placeholders :  <span id="${this.name}"></span>  <meta name="${this.name}" content="">  __unique-mark__`)
      const newContent = content
        .replace(new RegExp(`__${this.name}__`, 'g'), this.mark)
        .replace(new RegExp(`(<[a-z]+ .*id="${this.name}".*>)[^<]*(</[a-z]+>)`), `$1${this.mark}$2`)
        .replace(new RegExp(`(<meta name="${this.name}" content=")[^"]*(">)`), `$1${this.mark}$2`)
      const times = (newContent.match(new RegExp(this.mark, 'g')) || []).length
      writeFileSync(file, newContent)
      this.log(`injected in ${file}`, `${times} time${times > 1 ? 's' : ''}`)
    })
  }
}()
