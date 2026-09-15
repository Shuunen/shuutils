import fs from 'node:fs'
import path from 'node:path'

const regexExport = /^export (?:async )?(?:function|class) (?<name>[\w$]+)/gm,
  regexJsdocEnd = /\*\/\s*$/

export type Rule = {
  check: (content: string, filePath: string) => boolean
  error: string
  fixer?: (content: string, filePath: string) => string
  name: string
}

/**
 * Check if the given file is a test file
 * @param filePath the path of the file
 * @returns true if the file is a test file
 */
export function isTestFile(filePath: string): boolean {
  return filePath.endsWith('.test.ts')
}

/**
 * Check if the given file is a src/lib module, tests excluded
 * @param filePath the path of the file
 * @returns true if the file is a lib module
 */
export function isLibFile(filePath: string): boolean {
  return path.basename(path.dirname(filePath)) === 'lib' && !isTestFile(filePath)
}

/**
 * Check if the given module has a sibling test file
 * @param filePath the path of the module
 * @returns true if a sibling .test.ts file exists
 */
export function hasSiblingTest(filePath: string): boolean {
  return fs.existsSync(filePath.replace(/\.ts$/, '.test.ts'))
}

/**
 * Check if the given content exports a function or a class, type only, constant only and coverage ignored modules do not
 * @param content the content of the file
 * @returns true if the content exports a function or a class
 */
export function exportsBehaviour(content: string): boolean {
  if (content.trimStart().startsWith('/* v8 ignore start */')) return false
  return /^export (?:async )?(?:function|class) /m.test(content)
}

/**
 * Check if a line can be skipped when looking backwards for a JSDoc block
 * @param line the line to check
 * @returns true if the line is blank or a line comment
 */
export function isSkippableLine(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.length === 0 || trimmed.startsWith('//')
}

/**
 * List the exported functions and classes that are not preceded by a JSDoc block
 * @param content the content of the file
 * @returns the names of the undocumented exports
 */
export function getExportsWithoutJsdoc(content: string): string[] {
  const lines = content.split('\n'),
    missing: string[] = []
  for (const match of content.matchAll(regexExport)) {
    const name = match.groups?.name
    if (name === undefined) continue
    let previousIndex = content.slice(0, match.index).split('\n').length - 2
    // skip blank lines and line comments such as oxlint-disable-next-line
    while (previousIndex >= 0 && isSkippableLine(lines[previousIndex] ?? '')) previousIndex -= 1
    if (!regexJsdocEnd.test(lines[previousIndex]?.trim() ?? '')) missing.push(name)
  }
  return missing
}

/**
 * Check that the barrel file exports every sibling lib module
 * @param filePath the path of the file, ignored unless it is an index.ts
 * @returns true if the barrel is up to date
 */
export function isBarrelUpToDate(filePath: string): boolean {
  if (path.basename(filePath) !== 'index.ts') return true
  const libDirectory = path.join(path.dirname(filePath), 'lib')
  if (!fs.existsSync(libDirectory)) return true
  const content = fs.readFileSync(filePath, 'utf8')
  return fs
    .readdirSync(libDirectory)
    .filter(file => file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.d.ts'))
    .every(file => content.includes(`./lib/${file.replace(/\.ts$/, '')}'`) || content.includes(`./lib/${file.replace(/\.ts$/, '')}"`))
}

/**
 * Remove block and line comments from a file content
 * @param content the content of the file
 * @returns the content without comments
 */
export function stripComments(content: string): string {
  return content.replaceAll(/\/\*[\s\S]*?\*\//gu, '').replaceAll(/\/\/.*$/gmu, '')
}

/**
 * Check that a lib module does not call console directly
 * @param content the content of the file
 * @param filePath the path of the file
 * @returns true if no direct console call is found
 */
export function hasNoConsoleCall(content: string, filePath: string): boolean {
  if (!isLibFile(filePath) || path.basename(filePath) === 'browser-console.ts') return true
  return !/(?<![\w.])console\.(?:log|warn|error|info|debug)\(/u.test(stripComments(content))
}

/**
 * Check that a lib module does not import from a parent directory
 * @param content the content of the file
 * @param filePath the path of the file
 * @returns true if no parent import is found
 */
export function hasNoRelativeParentImport(content: string, filePath: string): boolean {
  if (!isLibFile(filePath)) return true
  return !content.includes("from '../") && !content.includes('from "../')
}

export const rules: Rule[] = [
  {
    check: (content, filePath) => !isLibFile(filePath) || !exportsBehaviour(content) || hasSiblingTest(filePath),
    error: 'every src/lib module exporting a function or class must have a sibling .test.ts file',
    name: 'lib-has-test',
  },
  {
    check: content => getExportsWithoutJsdoc(content).length === 0,
    error: 'every exported function or class must be preceded by a JSDoc block',
    name: 'exports-have-jsdoc',
  },
  {
    check: (_content, filePath) => isBarrelUpToDate(filePath),
    error: 'src/index.ts is out of date, run pnpm run list to regenerate it',
    name: 'barrel-up-to-date',
  },
  {
    check: hasNoConsoleCall,
    error: 'src/lib modules must not call console directly, use the Logger instead',
    name: 'no-console-in-lib',
  },
  {
    check: hasNoRelativeParentImport,
    error: 'src/lib modules must not import from a parent directory',
    name: 'no-parent-import-in-lib',
  },
]
