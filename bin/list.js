import { write } from 'bun'
import glob from 'tiny-glob'

const { log } = console

/**
 * List entries in src folder
 * @returns {Promise<void>}
 */
async function listEntries() {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const files = await glob('*.ts', { cwd: 'src', filesOnly: true })
  const list = files
    .filter(file => !(file.includes('shuutils.ts') || file.includes('unique-mark.ts') || file.includes('.test.ts')))
    .map(file => `export ${file.includes('types') ? 'type ' : ''}* from './${file.replace('.ts', '')}'`)
  const content = `${list.sort().join('\n')}\n`
  await write('src/shuutils.ts', content)
  log('src/shuutils.ts updated !')
}

await listEntries()
