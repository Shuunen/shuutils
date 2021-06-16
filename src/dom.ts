
export const dom = <T extends keyof HTMLElementTagNameMap> (type: T, classes = '', content = ''): HTMLElementTagNameMap[T] => {
  const element = document.createElement(type)
  element.className = classes
  element.innerHTML = content
  return element
}

export const img = (classes: string, source: string, alt: string): HTMLImageElement => {
  const element = dom('img', classes)
  element.alt = alt
  element.src = source
  return element
}
export const image = img

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
export const bold = strong

export const em = (classes: string, content = ''): HTMLElement => dom('em', classes, content)
export const italic = em

export const small = (classes: string, content = ''): HTMLElement => dom('small', classes, content)

export const h1 = (classes: string, content = ''): HTMLHeadingElement => dom('h1', classes, content)
export const h2 = (classes: string, content = ''): HTMLHeadingElement => dom('h2', classes, content)
export const h3 = (classes: string, content = ''): HTMLHeadingElement => dom('h3', classes, content)

export const div = (classes: string, content = ''): HTMLDivElement => dom('div', classes, content)
