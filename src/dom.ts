import { sleep } from './functions'

export const dom = <T extends keyof HTMLElementTagNameMap> (type: T, classes = '', content: string | Node = ''): HTMLElementTagNameMap[T] => {
  const element = document.createElement(type)
  element.className = classes
  if (typeof content === 'string') element.innerHTML = content
  else element.append(content)
  return element
}

export const img = (classes: string, source: string, alt: string): HTMLImageElement => {
  const element = dom('img', classes)
  element.alt = alt
  element.src = source
  return element
}
export const image = img

export const icon = (classes = ''): HTMLElement => dom('i', `icon ${classes}`)

export const a = (classes: string, content: string, href: string, newTab = false): HTMLAnchorElement => {
  const element = dom('a', classes, content)
  element.href = href
  if (newTab) element.target = '_blank'
  return element
}
export const link = a

export const p = (classes: string, content = ''): HTMLParagraphElement => dom('p', classes, content)
export const text = p

export const strong = (classes: string, content = ''): HTMLElement => dom('strong', classes, content)

export const em = (classes: string, content = ''): HTMLElement => dom('em', classes, content)

export const small = (classes: string, content = ''): HTMLElement => dom('small', classes, content)

export const h1 = (classes: string, content = ''): HTMLHeadingElement => dom('h1', classes, content)
export const h2 = (classes: string, content = ''): HTMLHeadingElement => dom('h2', classes, content)
export const h3 = (classes: string, content = ''): HTMLHeadingElement => dom('h3', classes, content)

export const div = (classes: string, content: string | HTMLElement = ''): HTMLDivElement => dom('div', classes, content)

/**
 * Generate a link to a css/stylesheet file
 * @param href the href/src
 * @returns the link element, ex: &lt;link type="text/css" href="../styles.css" rel="stylesheet" />
 */
export const css = (href: string): HTMLLinkElement => {
  const element = dom('link')
  element.href = href
  element.rel = 'stylesheet'
  element.type = 'text/css'
  return element
}

/**
 * QuerySelector wrapper with a short-hand syntax
 * @param selector  the css-like selector to find the element
 * @param context
 * @returns
 */
export const findOne = (selector: string, context: Document | HTMLElement = document) => {
  return context.querySelector(selector)
}

/**
 * QuerySelectorAll with a short-hand syntax that return an Array instead of NodeList
 * @param selector the css-like selector to find the elements
 * @param context the context to search in, document by default
 * @returns array of found elements
 */
export const findAll = (selector: string, context: Document | HTMLElement = document) => {
  return Array.prototype.slice.call(context.querySelectorAll(selector))
}

/**
 * Wait for an element to exists in DOM
 * @param selector the css-like selector to find the element, ex: '#super-id' or '.a-class'
 * @param wait time to wait in ms between each try, default 500ms
 * @param nbTries used for recursion, do not use it
 * @returns the element or undefined if not found
 */
export const waitToDetect = async (selector: string, wait = 500, nbTries = 0): Promise<Element | undefined> => {
  await sleep(wait)
  const element = findOne(selector)
  if (element) return element
  if (nbTries > 5) {
    console.log(`stop searching after 5 fails to detect : "${selector}"`)
    return
  }
  return waitToDetect(selector, wait, ++nbTries)
}
