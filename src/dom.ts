
export const dom = (type: string, classes = '', content = '') => {
  const element = document.createElement(type)
  element.className = classes
  element.innerHTML = content
  return element
}

export const img = (classes: string, src: string, alt: string) => {
  const element = dom('img', classes) as HTMLImageElement
  element.alt = alt
  element.src = src
  return element
}
export const image = img

export const a = (classes: string, content: string, href: string, newTab = false) => {
  const element = dom('a', classes, content) as HTMLAnchorElement
  element.href = href
  if (newTab) element.target = '_blank'
  return element
}
export const link = a

export const p = (classes: string, content = '') => dom('p', classes, content)
export const text = p

export const strong = (classes: string, content = '') => dom('strong', classes, content)
export const bold = strong

export const em = (classes: string, content = '') => dom('em', classes, content)
export const italic = em

export const small = (classes: string, content = '') => dom('small', classes, content)

export const h1 = (classes: string, content = '') => dom('h1', classes, content)
export const h2 = (classes: string, content = '') => dom('h2', classes, content)
export const h3 = (classes: string, content = '') => dom('h3', classes, content)

export const div = (classes: string, content = '') => dom('div', classes, content)
