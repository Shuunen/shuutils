import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import glob from 'tiny-glob'

/**
 * List entries in src folder
 * @returns {Promise<void>}
 */
async function listEntries() {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const files = await glob('*.ts', { cwd: path.join(cwd(), 'src/'), filesOnly: true })
  const list = files
    .filter(file => !(file.includes('index.ts') || file.includes('unique-mark.ts') || file.includes('.test.ts')))
    .map(file => `export * from './${file.replace('.ts', '')}'`)
  writeFileSync(path.join(cwd(), 'src/index.ts'), list.join('\n'))
}

// @ts-expect-error warn about the top-level await
await listEntries()
