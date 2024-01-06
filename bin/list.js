
import { writeFileSync } from 'fs'
import path from 'path'
import { cwd } from 'process'
import glob from 'tiny-glob'

/**
 * List entries in src folder
 * @returns void
 */
async function listEntries () {
  const files = await glob('*.ts', { cwd: path.join(cwd(), 'src/'), filesOnly: true })
  const list = files
    .filter(file => !file.includes('index.ts') && !file.includes('unique-mark.ts'))
    .map(file => `export * from './${file.replace('.ts', '')}'`)
  list.unshift('/* eslint-disable sonar/no-wildcard-import */')
  writeFileSync(path.join(cwd(), 'src/index.ts'), list.join('\n'))
}

// @ts-ignore
await listEntries()
