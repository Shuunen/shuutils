/**
 * Return a random number between min & max (0 & 100 if no args)
 * @param min (optional) the return number minimum included value
 * @param max (optional) the return number maximum included value
 * @returns number like : 12
 */
export function getRandomNumber(min = 0, max = 100) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
