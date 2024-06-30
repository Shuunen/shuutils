/* c8 ignore start */
import { sleep } from './functions'
import { getRandomNumber } from './number-random'

/**
 * Fill an input like a human would do
 * @param input the HTMLInputElement to fill
 * @param value the value to fill
 * @returns nothing
 * @example await utils.fillLikeHuman(input, 'hello world')
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export async function fillLikeHuman(input: HTMLInputElement, value: string) {
  input.focus()
  for (const char of value) {
    input.value += char
    await sleep(getRandomNumber(40, 80)) // eslint-disable-line no-await-in-loop, @typescript-eslint/no-magic-numbers
  }
  input.dispatchEvent(new Event('input', { bubbles: true })) // eslint-disable-line @typescript-eslint/naming-convention
  input.dispatchEvent(new Event('change', { bubbles: true })) // eslint-disable-line @typescript-eslint/naming-convention
  input.dispatchEvent(new Event('blur', { bubbles: true })) // eslint-disable-line @typescript-eslint/naming-convention
  input.blur()
}
