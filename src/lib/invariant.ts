/**
 * Assert that a condition is true, narrowing its type, and throw otherwise
 * @see https://github.com/toss/es-toolkit/blob/main/src/util/invariant.ts
 * @param condition the condition to assert
 * @param message the error message to throw when the condition is falsy
 * @throws an Error when the condition is falsy
 */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}
