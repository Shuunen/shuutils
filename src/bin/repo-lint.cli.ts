import fs from 'node:fs'
import path from 'node:path'
import glob from 'tiny-glob'
import { nbThird } from '../lib/constants'
import { rules } from './repo-lint.rules'

/**
 * Run every rule on a single file, applying fixers when they provide one
 * @param filePath the file to lint
 * @returns the list of issues found, empty when the file is clean
 */
export function lintFile(filePath: string): string[] {
  let content = fs.readFileSync(filePath, 'utf8'),
    changed = false
  const issues: string[] = []
  for (const rule of rules) {
    if (rule.fixer !== undefined) {
      const fixedContent = rule.fixer(content, filePath)
      if (fixedContent !== content) {
        content = fixedContent
        changed = true
      }
    }
    if (!rule.check(content, filePath)) issues.push(`(${rule.name}) ${rule.error}`)
  }
  if (changed) fs.writeFileSync(filePath, content, 'utf8')
  return issues
}

/**
 * Resolve the `--target` glob from the command line into absolute TypeScript file paths
 * @param argv the command-line arguments
 * @returns the absolute paths of the files to lint
 */
export async function getTargetFiles(argv: string[]): Promise<string[]> {
  const args: Record<string, string> = {}
  for (const arg of argv.slice(nbThird)) {
    const [key = '', value = ''] = arg.replace('--', '').split('=')
    if (key.length > 0) args[key] = value
  }
  const { target = '' } = args
  if (target.length === 0) throw new Error('missing target argument')
  const matches = await glob(target, { filesOnly: true })
  return matches.map(match => path.resolve(process.cwd(), match)).filter(match => match.endsWith('.ts') && !match.endsWith('.d.ts'))
}

/**
 * Entry point for the custom linter
 * @param argv the command-line arguments
 * @returns the report line when every file passes, throws otherwise
 */
export async function main(argv: string[]) {
  const files = await getTargetFiles(argv)
  const problems: string[] = []
  for (const filePath of files) for (const issue of lintFile(filePath)) problems.push(`File: ${path.relative(process.cwd(), filePath)} - Issue: ${issue}`)
  if (problems.length > 0) {
    for (const problem of problems) console.error(problem)
    throw new Error('Lint issues found.')
  }
  return `All custom rules passed successfully on ${files.length} files !`
}

/* v8 ignore start */
if (import.meta.main) console.log(await main(process.argv))
