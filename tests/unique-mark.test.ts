import { expect, it } from 'vitest'
import { version } from '../package.json'
import { generateMark, getPackageJsonVersion, getTargetFiles, injectMarkInFiles } from '../src/unique-mark'

it('getPackageJsonVersion A', () => {
  expect(getPackageJsonVersion()).toBe(version)
})

it('getPackageJsonVersion B pkg file not found', () => {
  expect(() => getPackageJsonVersion('non-existent.json')).toThrowErrorMatchingSnapshot()
})

it('getPackageJsonVersion C pkg file found but invalid json', () => {
  expect(() => getPackageJsonVersion('README.md')).toThrowErrorMatchingSnapshot()
})

it('getTargetFiles A list markdown files at root dir', async () => {
  expect(await getTargetFiles('*.md')).toMatchSnapshot()
})

it('getTargetFiles B list non existent files', async () => {
  await expect(async () => getTargetFiles()).rejects.toThrowErrorMatchingSnapshot()
})

const fakeMark = '9.7.8 - xyz - 07/05/2023 17:26:35'
it('generateMark A', () => {
  expect(generateMark({ commit: 'xyz', date: '07/05/2023 17:26:35', version: '9.7.8' })).toEqual(fakeMark)
})

it('injectMarkInFiles A successful', () => {
  expect(injectMarkInFiles({ files: ['src/strings.ts'], isReadOnly: true, mark: fakeMark, placeholder: 'placeholder' })).toMatchSnapshot()
})

it('injectMarkInFiles B fail to find placeholder', () => {
  expect(() => injectMarkInFiles({ files: ['src/strings.ts'], isReadOnly: true, mark: fakeMark, placeholder: 'nope' })).toThrowErrorMatchingSnapshot()
})
