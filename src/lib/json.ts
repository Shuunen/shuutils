import { objectDeserialize } from './object-serializer.ts'
import { Result } from './result.ts'

const jsonStartRegex = /^(?:\[\s*)?\{\s*"/u

/**
 * Check if the given string is a JSON object
 * @param jsonString The string to check
 * @returns The parsed object or false if parsing failed
 */
export function isJson(jsonString: string) {
  const hasValidStart = jsonStartRegex.test(jsonString)
  if (!hasValidStart) return false

  try {
    JSON.parse(jsonString)
  } catch {
    return false
  }
  return true
}

/**
 * Parse a supposed JSON string into an object
 * @param json The JSON string to parse
 * @param options the options
 * @param options.functions if true, functions serialized by objectSerialize are revived by running their source code, only use it on a trusted string, default false
 * @returns a Result, ok with the parsed value, or an error message like "Invalid JSON string: ..."
 * @example const result = parseJson<{ age: number }>('{ "age": 32 }')
 * if (result.ok) console.log(result.value.age)
 */
export function parseJson<Type>(json: string, { functions = false }: Readonly<{ functions?: boolean }> = {}) {
  try {
    return Result.ok(objectDeserialize(json, { functions }) as Type)
  } catch (error) {
    /* v8 ignore next */
    const message = error instanceof Error ? error.message : String(error)
    return Result.error(`Invalid JSON string: ${message}`)
  }
}
