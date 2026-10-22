const elementTagRegex = /^<[a-z.]+\b/u
const metaTagRegex = /^<meta\b/u
const closingTagRegex = /<\/[a-z.]+>/uy
// a whitespace before keeps another attribute like data-content="..." from matching
const contentAfterRegex = /\scontent="(?<value>[^"]*)"/du
const contentBeforeRegex = /\scontent="(?<value>[^"]*)" /du
const childrenRegex = /,children:"(?<value>[^"]*)"/du
const jsxCall = '.jsx('
// a minifier like rolldown calls an imported jsx as (0,e.jsx)(...)
const wrappedJsxCall = '.jsx)('
const whitespaceRegex = /\s/u

/**
 * Escape a placeholder so it is matched as is, not as a regex
 * @param placeholder the placeholder like "app.mark" or "mark(1)"
 * @returns the escaped placeholder, ready to be used in a regex
 */
function escapePlaceholder(placeholder: string) {
  return placeholder.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`)
}

/**
 * Find the start of the tag holding a position, skipping a "<" inside an earlier attribute value like title="1<2"
 * @param content the string to look into
 * @param at the position inside the tag
 * @param tagRegex the regex the tag start must match, like /^<meta\b/u
 * @returns the "<" position, or -1 when the position is not inside such a tag
 */
function tagStart(content: string, at: number, tagRegex: Readonly<RegExp>) {
  for (let open = content.lastIndexOf('<', at); open !== -1; open = open === 0 ? -1 : content.lastIndexOf('<', open - 1)) {
    const head = content.slice(open, at)
    if (head.includes('>')) return -1
    if (tagRegex.test(head)) return open
  }
  return -1
}

/**
 * Find the ">" closing a tag, skipping the ones inside a quoted attribute value like x-show="count > 0"
 * @param content the string to look into
 * @param from a position inside the tag, outside any attribute value
 * @returns the ">" position, or -1 when the tag is not closed
 */
function tagEnd(content: string, from: number) {
  let quote = ''
  for (let index = from; index < content.length; index += 1) {
    const char = content.charAt(index)
    if (quote !== '') quote = char === quote ? '' : quote
    else if (char === '"' || char === "'") quote = char
    else if (char === '>') return index
  }
  return -1
}

/**
 * List the tags holding an attribute, found with indexOf : a regex starting at every "<" backtracks quadratically on a big minified chunk
 * @param content the string to look into
 * @param attribute the attribute like 'id="app-mark"'
 * @param tagRegex the regex the tag start must match, like /^<meta\b/u
 * @yields {{ at: number, close: number, open: number }} the attribute position, and the tag "<" and ">" positions
 */
function* tagsWith(content: string, attribute: string, tagRegex: Readonly<RegExp>) {
  for (let at = content.indexOf(attribute); at !== -1; at = content.indexOf(attribute, at + attribute.length)) {
    // a tag attribute follows a whitespace, a selector like [id="app-mark"] in a minified chunk does not
    if (!whitespaceRegex.test(content.charAt(at - 1))) continue
    const open = tagStart(content, at, tagRegex)
    const close = tagEnd(content, at + attribute.length)
    if (open !== -1 && close !== -1) yield { at, close, open }
  }
}

/**
 * Replace the value captured by a regex with the d flag in a part of a string
 * @param content the whole string
 * @param offset where the part starts in the whole string
 * @param options the options
 * @param options.indices the indices of the part match, undefined when the part did not match
 * @param options.mark the mark to put in place of the value
 * @returns the string with the mark in place of the value, or undefined when the part did not match
 */
function replaceValue(content: string, offset: number, { indices, mark }: Readonly<{ indices: RegExpIndicesArray | undefined; mark: string }>) {
  const value = indices?.groups?.value
  if (value === undefined) return undefined
  return `${content.slice(0, offset + value[0])}${mark}${content.slice(offset + value[1])}`
}

/**
 * Inject a mark as the text of the first element holding an attribute, like `<span id="placeholder">...</span>`
 * @param content the string to inject the mark in
 * @param attribute the attribute like 'id="app-mark"'
 * @param mark the mark to inject
 * @returns the string with the mark injected
 */
function injectInElement(content: string, attribute: string, mark: string) {
  for (const { close } of tagsWith(content, attribute, elementTagRegex)) {
    const textEnd = content.indexOf('<', close)
    closingTagRegex.lastIndex = textEnd
    if (textEnd !== -1 && closingTagRegex.test(content)) return `${content.slice(0, close + 1)}${mark}${content.slice(textEnd)}`
  }
  return content
}

/**
 * Inject a mark in the content attribute of the first meta holding an attribute, with the content attribute after or before it
 * @param content the string to inject the mark in
 * @param attribute the attribute like 'name="app-mark"'
 * @param mark the mark to inject
 * @returns the string with the mark injected
 */
function injectInMeta(content: string, attribute: string, mark: string) {
  let updated = content
  for (const { at, close } of tagsWith(updated, attribute, metaTagRegex)) {
    const replaced = replaceValue(updated, at, { indices: contentAfterRegex.exec(updated.slice(at, close))?.indices, mark })
    if (replaced === undefined) continue
    updated = replaced
    break
  }
  for (const { at, open } of tagsWith(updated, attribute, metaTagRegex)) {
    const replaced = replaceValue(updated, open, { indices: contentBeforeRegex.exec(updated.slice(open, at))?.indices, mark })
    if (replaced !== undefined) return replaced
  }
  return updated
}

/**
 * Inject a mark as the children of the first jsx call holding an attribute, like `r.jsx("span",{id:"placeholder"})`
 * @param content the string to inject the mark in
 * @param attribute the attribute like 'id:"app-mark"'
 * @param mark the mark to inject
 * @returns the string with the mark injected, a children already injected by a previous run is replaced
 */
function injectInJsx(content: string, attribute: string, mark: string) {
  for (let at = content.indexOf(attribute); at !== -1; at = content.indexOf(attribute, at + attribute.length)) {
    const open = content.lastIndexOf('{', at)
    const close = content.indexOf('}', at)
    const wrappedCall = content.lastIndexOf(wrappedJsxCall, open)
    const call = Math.max(content.lastIndexOf(jsxCall, open), wrappedCall)
    const component = content.slice(call + (call === wrappedCall ? wrappedJsxCall : jsxCall).length, open - 1)
    const isJsxProps = open > 0 && close !== -1 && call > 0 && content[open - 1] === ',' && component !== '' && !component.includes(',') && !content.slice(open, at).includes('}')
    if (!isJsxProps || !/\w/u.test(content.charAt(call - 1))) continue
    const props = content.slice(at, close)
    const children = childrenRegex.exec(props)
    // a nested object or a template literal before it means the first "}" does not close the props, so their children are out of reach
    if (children && !/[{`]/u.test(props.slice(attribute.length, children.index))) return replaceValue(content, at, { indices: children.indices, mark }) ?? content
    // right after the attribute, a nested object or a template literal later in the props stays intact
    const end = at + attribute.length
    return `${content.slice(0, end)},children:"${mark}"${content.slice(end)}`
  }
  return content
}

/**
 * Inject a mark in a string at a specific placeholder locations like
 * `__placeholder__` or `<div id="placeholder">...</div>` or `<meta name="placeholder" content="..." />`
 * @param content the string to inject the mark in
 * @param placeholder the placeholder to replace
 * @param mark the mark to inject
 * @returns the new string with the mark injected
 */
export function injectMark(content: string, placeholder: string, mark: string) {
  // every placeholder form holds the placeholder, so a bundle chunk without it skips all the work
  if (!content.includes(placeholder)) return content
  // a placeholder like "app.mark" or "mark(1)" is matched as is, and replacer functions keep a "$" in the mark from being read as a replacement pattern like "$1"
  const replaced = content.replaceAll(`__${placeholder}__`, () => mark).replaceAll(new RegExp(`{{2} ?${escapePlaceholder(placeholder)} ?}{2}`, 'g'), () => mark)
  const inElement = injectInElement(replaced, `id="${placeholder}"`, mark)
  const inJsx = injectInJsx(injectInMeta(inElement, `name="${placeholder}"`, mark), `id:"${placeholder}"`, mark)
  // a minifier like rolldown writes the jsx props with backticks, like {id:`placeholder`}
  return injectInJsx(inJsx, `id:\`${placeholder}\``, mark)
}

/**
 * Count the placeholder-shaped usages in a string, the ones injectMark replaces and the near ones it does not, like a single quoted id
 * @param content the string to look into
 * @param placeholder the placeholder to count
 * @returns the number of placeholder-shaped usages, the bare placeholder word and a css selector like `[name="placeholder"]` do not count
 * @example countPlaceholders('<span id="app-mark"></span> __app-mark__', 'app-mark') // 2
 */
export function countPlaceholders(content: string, placeholder: string) {
  if (!content.includes(placeholder)) return 0
  const name = escapePlaceholder(placeholder)
  // a markup attribute follows a space, a selector attribute follows a "[", an object property uses a ":"
  return content.match(new RegExp(`__${name}__|\\{{2} ?${name} ?\\}{2}|(?<=\\s)(?:id|name) ?= ?["'\`]${name}["'\`]|(?:id|name) ?: ?["'\`]${name}["'\`]`, 'gu'))?.length ?? 0
}
