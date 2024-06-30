// for each file in dist folder, add a line at the top of the file

import { readFileSync, writeFileSync } from 'node:fs'
import glob from 'tiny-glob'

const binaries = ['unique-mark.js']
const banner = '// shuutils __unique-mark__'
const shebang = '#!/usr/bin/env node'

/**
 * Add a banner at the top of the file
 * @param {string} filePath - The file path
 * @param {string} line - The line to add
 */
function addLine(filePath, line) {
  let content = readFileSync(filePath, 'utf8')
  if (content.includes(shebang)) content = content.replace(shebang, '')
  if (content.includes(line)) return
  writeFileSync(filePath, `${line}\n${content}`)
}

/**
 * Do the shuutils lib build
 * @returns {Promise<void>}
 */
async function addLines() {
  const files = await glob('dist/*')
  for (const filePath of files) {
    addLine(filePath, banner)
    if (binaries.some(binary => filePath.includes(binary))) addLine(filePath, shebang)
  }
}

// @ts-expect-error warn about the top-level await
await addLines()
