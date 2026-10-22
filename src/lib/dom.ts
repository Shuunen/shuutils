import { nbDaysInWeek, nbSpacesIndent } from './constants.ts'
import { Result } from './result.ts'
import { sleep } from './sleep.ts'

type DomContent = Node | Node[] | string

/**
 * Generate a dom element
 * @param type the type of the element, like 'div' or 'span'
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated dom element
 */
export function dom<Tag extends keyof HTMLElementTagNameMap>(type: Tag, classes = '', content: DomContent = '') {
  const element = document.createElement(type)
  element.className = classes
  if (typeof content === 'string') element.innerHTML = content
  else if (content instanceof Node) element.append(content)
  else for (const node of content) element.append(node)

  return element
}

/**
 * Generate an image <img> element
 * @param classes the custom classes to add to the element
 * @param source the source of the image
 * @param alt the alt text of the image
 * @returns the generated image element
 */
export function img(classes: string, source: string, alt: string) {
  const element = dom('img', classes)
  element.alt = alt
  element.src = source
  return element
}

/**
 * Generate an icon element with a <i> tag
 * @param classes the custom classes to add to the element
 * @returns the generated icon element
 */
export function icon(classes = '') {
  return dom('i', `icon ${classes}`)
}

/**
 * Generate a link <a> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @param href the href of the link
 * @param options the options
 * @param options.newTab true if the link should open in a new tab
 * @returns the generated link element
 */
// oxlint-disable-next-line max-params
export function link(classes: string, content: DomContent, href: string, { newTab = false }: Readonly<{ newTab?: boolean }> = {}) {
  const element = dom('a', classes, content)
  element.href = href
  if (newTab) element.target = '_blank'

  return element
}

/**
 * Generate a paragraph <p> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated paragraph element
 */
export function text(classes: string, content: DomContent = '') {
  return dom('p', classes, content)
}

/**
 * Generate a <strong> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated strong element
 */
export function strong(classes: string, content: DomContent = '') {
  return dom('strong', classes, content)
}

/**
 * Generate an emphasis <em> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated emphasis element
 */
export function em(classes: string, content: DomContent = '') {
  return dom('em', classes, content)
}

/**
 * Generate a <small> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated small element
 */
export function small(classes: string, content: DomContent = '') {
  return dom('small', classes, content)
}

/**
 * Generate a <h1> heading element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated heading element
 */
export function h1(classes: string, content: DomContent = '') {
  return dom('h1', classes, content)
}

/**
 * Generate a <h2> heading element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated heading element
 */
export function h2(classes: string, content: DomContent = '') {
  return dom('h2', classes, content)
}

/**
 * Generate a <h3> heading element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated heading element
 */
export function h3(classes: string, content: DomContent = '') {
  return dom('h3', classes, content)
}

/**
 * Generate a <ul> list element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated list element
 */
export function ul(classes: string, content: DomContent = '') {
  return dom('ul', classes, content)
}

/**
 * Generate a <li> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated list element
 */
export function li(classes: string, content: DomContent = '') {
  return dom('li', classes, content)
}

/**
 * Generate a <div> element
 * @param classes the custom classes to add to the element
 * @param content the content of the element, can be a string, another dom element or an array of dom elements
 * @returns the generated div element
 */
export function div(classes: string, content: DomContent = '') {
  return dom('div', classes, content)
}

/**
 * Generate a link to a css/stylesheet file
 * @param href the href/src
 * @returns the link element, ex: &lt;link type="text/css" href="../styles.css" rel="stylesheet" />
 */
export function css(href: string) {
  const element = dom('link')
  element.href = href
  element.rel = 'stylesheet'
  element.type = 'text/css'
  return element
}

type SelectorCombinator = ' ' | '>' | '+' | '~'

type LastCompoundSelector<Selector extends string> = Selector extends `${string}${SelectorCombinator}${infer Rest}` ? LastCompoundSelector<Rest> : Selector

type SelectorTagName<Compound extends string> = Compound extends `${infer Tag}${'.' | '#' | '[' | ':'}${string}` ? SelectorTagName<Tag> : Lowercase<Compound>

type ElementForTag<Tag extends string> = Tag extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Tag] : Tag extends keyof SVGElementTagNameMap ? SVGElementTagNameMap[Tag] : HTMLElement

/**
 * The element type matched by a css selector, read from the tag of its last compound selector, HTMLElement when there is none.
 * A selector list or a functional pseudo-class like `:has()` can match another element than its last tag, so it gives HTMLElement too.
 * @example SelectedElement<'form > input[name="email"]'> is HTMLInputElement, SelectedElement<'.card'> is HTMLElement
 */
export type SelectedElement<Selector extends string> = Selector extends `${string}${'(' | ','}${string}` ? HTMLElement : ElementForTag<SelectorTagName<LastCompoundSelector<Selector>>>

/**
 * QuerySelector wrapper with a short-hand syntax, the element type is inferred from the selector tag
 * @param selector the css-like selector to find the element
 * @param context the dom context to search in
 * @returns the element or undefined if not found
 * @example findOne('input[name="email"]')?.value
 */
export function findOne<Selector extends string>(selector: Selector, context?: Document | HTMLElement): SelectedElement<Selector> | undefined
/**
 * QuerySelector wrapper with a short-hand syntax, for selectors without a tag
 * @param selector the css-like selector to find the element
 * @param context the dom context to search in
 * @returns the element or undefined if not found
 * @example findOne<HTMLInputElement>('.email')?.value
 */
// oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- like querySelector, lets callers name the type a selector without tag cannot express
export function findOne<Type extends Element>(selector: string, context?: Document | HTMLElement): Type | undefined
/**
 * QuerySelector wrapper with a short-hand syntax
 * @param selector the css-like selector to find the element
 * @param context the dom context to search in
 * @returns the element or undefined if not found
 */
export function findOne(selector: string, context: Document | HTMLElement = document) {
  return context.querySelector(selector) ?? undefined
}

/**
 * QuerySelectorAll with a short-hand syntax that return an Array instead of NodeList, the element type is inferred from the selector tag
 * @param selector the css-like selector to find the elements
 * @param context the context to search in, document by default
 * @returns array of found elements
 * @example findAll('input').map(input => input.value)
 */
export function findAll<Selector extends string>(selector: Selector, context?: Document | HTMLElement): SelectedElement<Selector>[]
/**
 * QuerySelectorAll with a short-hand syntax that return an Array instead of NodeList, for selectors without a tag
 * @param selector the css-like selector to find the elements
 * @param context the context to search in, document by default
 * @returns array of found elements
 * @example findAll<HTMLInputElement>('.field').map(input => input.value)
 */
export function findAll<Type extends Element>(selector: string, context?: Document | HTMLElement): Type[]
/**
 * QuerySelectorAll with a short-hand syntax that return an Array instead of NodeList
 * @param selector the css-like selector to find the elements
 * @param context the context to search in, document by default
 * @returns array of found elements
 */
export function findAll(selector: string, context: Document | HTMLElement = document) {
  return Array.from(context.querySelectorAll(selector))
}

/**
 * Wait for an element to exist in the DOM, checking right away then again after each wait
 * @param selector the css-like selector to find the element, ex: '#super-id' or '.a-class'
 * @param options the options
 * @param options.wait time to wait in ms between two tries, default 500ms
 * @param options.maxTries the number of tries before giving up, default 5
 * @returns a Result with the element, or an error once every try failed
 * @example const result = await waitToDetect('input[name="email"]', { maxTries: 10, wait: 200 })
 */
export async function waitToDetect<Selector extends string>(selector: Selector, { maxTries = 5, wait = 500 }: Readonly<{ maxTries?: number; wait?: number }> = {}) {
  const totalTries = Number.isNaN(maxTries) ? 1 : Math.max(1, Math.floor(maxTries))
  for (let tries = 1; tries <= totalTries; tries += 1) {
    const element = findOne(selector)
    if (element) return Result.ok(element)
    // oxlint-disable-next-line no-await-in-loop -- each try must wait for the previous one
    if (tries < totalTries) await sleep(wait)
  }
  return Result.error(`stop searching after ${totalTries} tries to detect "${selector}"`)
}

/**
 * Set an element height to its content height, you should use it debounced like :
 * ```
 * const scrollToHeight = debounce((element: HTMLElement) => scrollToHeightSync(element), 100)
 * ```
 * @param element the element to set height to
 */
export async function scrollToHeightSync(element: HTMLElement) {
  const initial = element.style.height
  element.style.height = 'inherit'
  const target = element.scrollHeight + nbSpacesIndent
  element.style.height = initial
  await sleep(nbDaysInWeek)
  element.style.height = `${target}px`
}

/**
 * Generate a backdrop element
 * @param classes the classes to add to the backdrop
 * @returns the backdrop element
 */
export function backdrop(classes: string) {
  return div(`backdrop ${classes} fixed top-0 left-0 z-10 w-full h-full opacity-0 pointer-events-none`)
}

/**
 * Tw is a callee mock for tailwindcss, it will return the classes as a string
 * @param classes the classes to return
 * @returns the classes as a string
 */
export function tw(classes: Readonly<string[]> | Readonly<TemplateStringsArray> | string) {
  if (typeof classes === 'string') return classes

  return classes.join(' ')
}
