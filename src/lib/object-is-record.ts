/**
 * Check if a value is a plain object, i.e. created by the Object constructor or with a null prototype
 * @see https://github.com/toss/es-toolkit/blob/main/src/predicate/isPlainObject.ts
 * @param value the value to check
 * @returns true if the value is a plain object
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false

  const prototype: unknown = Object.getPrototypeOf(value)
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) return false

  return !(Symbol.toStringTag in value) && !(Symbol.iterator in value)
}
