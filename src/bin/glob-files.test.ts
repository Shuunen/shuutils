import { globFiles } from './glob-files'

describe('glob-files', () => {
  it('globFiles A list files with a simple extension', async () => {
    const files = await globFiles('src/bin/*.ts')
    expect(files).toContain('src/bin/glob-files.ts')
    expect(files).not.toContain('src/bin/__snapshots__')
  })

  it('globFiles B list files with a brace extension list', async () => {
    const files = await globFiles('*.{md,json}')
    expect(files).toContain('README.md')
    expect(files).toContain('package.json')
  })

  it('globFiles C keep the single brace syntax of tiny-glob working', async () => {
    const files = await globFiles('*.{md}')
    expect(files).toContain('README.md')
    expect(files).not.toContain('package.json')
  })

  it('globFiles D normalize a leading dot slash', async () => {
    const files = await globFiles('./src/bin/glob-files.ts')
    expect(files).toStrictEqual(['src/bin/glob-files.ts'])
  })

  it('globFiles E include directories by default', async () => {
    const files = await globFiles('src/bin/*')
    expect(files).toContain('src/bin/__snapshots__')
  })

  it('globFiles F skip directories with filesOnly', async () => {
    const files = await globFiles('src/bin/*', { filesOnly: true })
    expect(files).not.toContain('src/bin/__snapshots__')
    expect(files).toContain('src/bin/glob-files.ts')
  })

  it('globFiles G return an empty list when nothing matches', async () => {
    const files = await globFiles('nope-*')
    expect(files).toStrictEqual([])
  })
})
