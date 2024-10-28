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
    .filter(file => !(file.includes('shuutils.ts') || file.includes('unique-mark.ts') || file.includes('.test.ts')))
    .map(file => `export * from './${file.replace('.ts', '')}'`)
  const content = `${list.join('\n')}\n`
  writeFileSync(path.join(cwd(), 'src/shuutils.ts'), content)
}

await listEntries()
