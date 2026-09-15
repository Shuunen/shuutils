/**
 * Check if a value is null or undefined
 * @see https://github.com/toss/es-toolkit/blob/main/src/predicate/isNil.ts
 * @param value the value to check
 * @returns true if the value is null or undefined
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined
}
