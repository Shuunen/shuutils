/**
 * Return an item from an array
 * @param items like : ["great", "place", "pine"]
 * @returns item like : "pine"
 */
export function pickOne<T> (items: T[]): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return items[Math.floor(Math.random() * items.length)] as T
}
