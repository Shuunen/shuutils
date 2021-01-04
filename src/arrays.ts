
/**
 * Return an item from an array
 * @param Array items like : ["great", "place", "pine"]
 * @return item like : "pine"
 */
export function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
