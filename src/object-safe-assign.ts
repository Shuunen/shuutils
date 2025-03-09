/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { isRecord } from './objects'

/**
 * Like Object.assign but only non-null/undefined values can overwrite
 * @param target Destination object
 * @param sources Object(s) to sequentially merge
 * @returns The resulting object merged
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export function safeAssign(target: Record<string, unknown>, ...sources: Readonly<Record<string, unknown>>[]) {
  if (sources.length === 0) return target
  const source = sources.shift()
  if (isRecord(target) && isRecord(source))
    for (const key in source)
      if (isRecord(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} }) // eslint-disable-line @typescript-eslint/strict-boolean-expressions

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
        safeAssign(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
      } else if (source[key] !== null && source[key] !== undefined) Object.assign(target, { [key]: source[key] })
  return safeAssign(target, ...sources)
}
