import { glob } from 'node:fs/promises'
import path from 'node:path'

// tiny-glob needed "*.{js}" to match an extension, node glob only expands braces with a comma, so keep the old syntax working
const singleBraceRegex = /\{(?<item>[^{},]*)\}/gu

/**
 * List the paths matching a glob, using the native node glob
 * @param pattern the glob to match, like "src/*.ts" or "public/*.{js,css}"
 * @param options the options
 * @param options.filesOnly true to skip directories
 * @returns the matching paths, relative to the current working directory
 */
export async function globFiles(pattern: string, { filesOnly = false } = {}) {
  const files: string[] = []
  const normalized = pattern.replaceAll(singleBraceRegex, '$<item>')
  for await (const entry of glob(normalized, { withFileTypes: true })) if (!filesOnly || entry.isFile()) files.push(path.relative(process.cwd(), path.join(entry.parentPath, entry.name)))
  return files
}
