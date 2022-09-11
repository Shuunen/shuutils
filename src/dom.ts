import { sleep } from './functions'

/**
 * Generate a dom element
 * @param type the type of the element, like 'div' or 'span'
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated dom element
 */
export const dom = <T extends keyof HTMLElementTagNameMap> (type: T, classes = '', content: string | Node | Node[] = ''): HTMLElementTagNameMap[T] => {
  const element = document.createElement(type)
  element.className = classes
  if (typeof content === 'string') element.innerHTML = content
  else if (content instanceof Node) element.append(content)
  else content.forEach(node => element.append(node))
  return element
}

/**
 * Generate an image <img> element
 * @param classes the custom classes to add to the element
 * @param source the source of the image
 * @param alt the alt text of the image
 * @returns the generated image element
 */
export const img = (classes: string, source: string, alt: string): HTMLImageElement => {
  const element = dom('img', classes)
  element.alt = alt
  element.src = source
  return element
}
export const image = img

/**
 * Generate an icon element with a <i> tag
 * @param classes the custom classes to add to the element
 * @returns the generated icon element
 */
export const icon = (classes = ''): HTMLElement => dom('i', `icon ${classes}`)

/**
 * Generate a link <a> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @param href the href of the link
 * @param newTab true if the link should open in a new tab
 * @returns the generated link element
 */
export const a = (classes: string, content: string | Node | Node[], href: string, newTab = false): HTMLAnchorElement => {
  const element = dom('a', classes, content)
  element.href = href
  if (newTab) element.target = '_blank'
  return element
}
export const link = a

/**
 * Generate a paragraph <p> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated paragraph element
 */
export const p = (classes: string, content: string | Node | Node[] = ''): HTMLParagraphElement => dom('p', classes, content)
export const text = p

/**
 * Generate a <strong> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated strong element
 */
export const strong = (classes: string, content: string | Node | Node[] = ''): HTMLElement => dom('strong', classes, content)

/**
 * Generate an emphasis <em> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated emphasis element
 */
export const em = (classes: string, content: string | Node | Node[] = ''): HTMLElement => dom('em', classes, content)

/**
 * Generate a <small> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated small element
 */
export const small = (classes: string, content: string | Node | Node[] = ''): HTMLElement => dom('small', classes, content)

/**
 * Generate a <h1> heading element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated heading element
 */
export const h1 = (classes: string, content: string | Node | Node[] = ''): HTMLHeadingElement => dom('h1', classes, content)

/**
 * Generate a <h2> heading element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated heading element
 */
export const h2 = (classes: string, content: string | Node | Node[] = ''): HTMLHeadingElement => dom('h2', classes, content)

/**
 * Generate a <h3> heading element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated heading element
 */
export const h3 = (classes: string, content: string | Node | Node[] = ''): HTMLHeadingElement => dom('h3', classes, content)

/**
 * Generate a <ul> list element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated list element
 */
export const ul = (classes: string, content: string | Node | Node[] = ''): HTMLUListElement => dom('ul', classes, content)

/**
 * Generate a <li> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated list element
 */
export const li = (classes: string, content: string | Node | Node[] = ''): HTMLLIElement => dom('li', classes, content)

/**
 * Generate a <div> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated div element
 */
export const div = (classes: string, content: string | Node | Node[] = ''): HTMLDivElement => dom('div', classes, content)

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
 * @param selector the css-like selector to find the element
 * @param context the dom context to search in
 * @returns the element or null if not found
 */
export const findOne = (selector: string, context: Document | HTMLElement = document): HTMLElement | null => {
  return context.querySelector(selector)
}

/**
 * QuerySelectorAll with a short-hand syntax that return an Array instead of NodeList
 * @param selector the css-like selector to find the elements
 * @param context the context to search in, document by default
 * @returns array of found elements
 */
export const findAll = (selector: string, context: Document | HTMLElement = document): HTMLElement[] => {
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

/**
 * Set an element height to its content height, you should use it debounced like :
 * ```
 * const scrollToHeight = debounce((element: HTMLElement) => scrollToHeightSync(element), 100)
 * ```
 * @param element the element to set height to
 */
export const scrollToHeightSync = async (element: HTMLElement): Promise<void> => {
  const initial = element.style.height
  element.style.height = 'inherit'
  const target = element.scrollHeight + 2
  element.style.height = initial
  await sleep(10)
  element.style.height = target + 'px'
}

/**
 * Generate a backdrop element
 * @param classes the classes to add to the backdrop
 * @returns the backdrop element
 */
export const backdrop = (classes: string): HTMLDivElement => div(`backdrop ${classes} fixed top-0 left-0 z-10 w-full h-full opacity-0 pointer-events-none`)


/**
 * Tw is a callee mock for tailwindcss, it will return the classes as a string
 * @param classes the classes to return
 * @returns the classes as a string
 */
export const tw = (classes: string): string => classes
