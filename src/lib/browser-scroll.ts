/* v8 ignore start */
import { invariant } from './invariant'

/**
 * Smoothly scroll the page to the first element matching the given selector
 * @param querySelector the selector of the element to scroll to
 * @throws an Error if no element matches the selector
 */
export function scrollToElement(querySelector: string) {
  const element = globalThis.document.querySelector(querySelector)
  invariant(element, `Cannot find element for query ${querySelector}`)
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}
