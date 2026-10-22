/**
 * Cap the nesting level of an object
 * @param object the object to cap
 * @param maxLevel like : `2`, the top level object is always kept, so values below 1 act like 1
 * @returns item like : `{ name : "Pine" }`
 */
export function capNesting(object: Readonly<Record<string, unknown>>, maxLevel = 3) {
  const one = 1
  const lastLevel = Math.max(maxLevel, one)
  /**
   * Helper function to cap the nesting level of an object.
   * @param currentObject - The current object to cap the nesting level.
   * @param currentLevel - The current nesting level.
   * @returns The capped object.
   */
  function capHelper(currentObject: unknown, currentLevel: number): unknown {
    if (currentLevel > lastLevel) return '...'

    if (typeof currentObject !== 'object' || currentObject === null) return currentObject

    if (Array.isArray(currentObject)) return currentObject.map((item: unknown) => capHelper(item, currentLevel + one))

    const result: Record<string, unknown> = {}
    // defineProperty keeps an own "__proto__" key, like one from JSON.parse, as a key instead of changing the result prototype
    for (const [key, value] of Object.entries(currentObject)) Object.defineProperty(result, key, { configurable: true, enumerable: true, value: capHelper(value, currentLevel + one), writable: true })

    return result
  }
  return capHelper(object, one) as Record<string, unknown>
}
