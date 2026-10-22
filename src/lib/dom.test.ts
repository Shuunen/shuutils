import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { backdrop, css, div, dom, em, findAll, findOne, h1, h2, h3, icon, img, li, link, scrollToHeightSync, small, strong, text, tw, ul, waitToDetect } from './dom.ts'
import { Result } from './result.ts'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

/**
 * Find an element from a selector only known at runtime
 * @param selector the css selector
 * @returns the element or undefined
 */
function findDynamic(selector: string) {
  return findOne(selector)
}

describe('dom', () => {
  it('custom type dom element with no classes', () => {
    const element = dom('article')
    expect(element.tagName.toLowerCase()).toBe('article')
    expect(element.className).toBe('')
  })

  it('custom type dom element with classes', () => {
    const element = dom('strong', 'important important--stuff')
    expect(element.tagName.toLowerCase()).toBe('strong')
    expect(element.className).toBe('important important--stuff')
    expect(element.classList.contains('important--stuff')).toBe(true)
  })

  it('custom type dom element with classes & text content', () => {
    const element = dom('i', 'italic', 'Hello John Cena')
    expect(element.textContent).toBe('Hello John Cena')
    expect(element.innerHTML).toBe('Hello John Cena')
  })

  it('custom type dom element with classes & html content', () => {
    const element = dom('i', 'italic', '<p>Hello John Cena</p>')
    expect(element.textContent).toBe('Hello John Cena')
    expect(element.tagName.toLowerCase()).toBe('i')
    expect(element.innerHTML).toBe('<p>Hello John Cena</p>')
  })

  it('custom type dom element with classes & dom element content', () => {
    const element = dom('i', 'italic', text('pizza', 'John Pepe'))
    expect(element.textContent).toBe('John Pepe')
    expect(element.tagName.toLowerCase()).toBe('i')
    expect(element.innerHTML).toBe('<p class="pizza">John Pepe</p>')
  })

  it('img', () => {
    const element = img('profile-short', 'https://cdn.com/image-short.jpg', 'profile-short picture')
    expect(element.alt).toBe('profile-short picture')
    expect(element.tagName.toLowerCase()).toBe('img')
    expect(element.src).toBe('https://cdn.com/image-short.jpg')
  })

  it('icon', () => {
    const element = icon('fas fa-profile')
    expect(element.className).toBe('icon fas fa-profile')
  })

  it('link', () => {
    const element = link('link', 'go to home page', '#home')
    expect(element.tagName.toLowerCase()).toBe('a')
    expect(element.textContent).toBe('go to home page')
    expect(element.href).toContain('#home') // el.href returns "about:blank#home"
    expect(element.target).toBe('')
  })

  it('link that open in a new tab', () => {
    const element = link('link', 'go to external page', 'https://duckduckgo.com/', { newTab: true })
    expect(element.href).toBe('https://duckduckgo.com/')
    expect(element.textContent).toBe('go to external page')
    expect(element.target).toBe('_blank')
  })

  it('dom list ul/li', () => {
    const element = li('item', 'item 1')
    expect(element.tagName.toLowerCase()).toBe('li')
    expect(element.textContent).toBe('item 1')
    const list = ul('list', element)
    expect(list.tagName.toLowerCase()).toBe('ul')
    expect(list.textContent).toBe('item 1')
    expect(list.childElementCount).toBe(1)
  })

  it('dom backdrop', () => {
    const element = backdrop('custom-class')
    expect(element.tagName.toLowerCase()).toBe('div')
    expect(element.classList.contains('backdrop')).toBe(true)
    expect(element.classList.contains('custom-class')).toBe(true)
  })

  it('dom basics', () => {
    const funcs = [strong, em, small, h1, h2, h3, div]
    for (const testFunction of funcs) {
      const { name } = testFunction
      const element = testFunction(name)
      expect(element.tagName.toLowerCase()).toBe(name)
      expect(element.textContent).toBe('')
      expect(element.classList.contains(name)).toBe(true)
      const elementContent = testFunction(name, `I really like guacamole with ${name}`)
      expect(elementContent.tagName.toLowerCase()).toBe(name)
      expect(elementContent.textContent).toBe(`I really like guacamole with ${name}`)
    }
  })

  it('dom handle multiple children', () => {
    const element = div('div', [text('p', 'text 1'), text('p', 'text 2')])
    expect(element.childElementCount).toBe(2)
    expect(element.textContent).toBe('text 1text 2')
  })

  it('css link', () => {
    const element = css('https://cdn.net/style.css')
    expect(element.href).toBe('https://cdn.net/style.css')
    expect(element.rel).toBe('stylesheet')
    expect(element.type).toBe('text/css')
  })

  it('dive div in a Dave div has Life in a div', () => {
    const element = div('Dave', div('dive', 'Life in a div'))
    expect(element.tagName.toLowerCase()).toBe('div')
    expect(element.innerHTML).toBe('<div class="dive">Life in a div</div>')
  })

  it('find one', () => {
    expect(findOne('body')?.tagName).toBe('BODY')
  })

  it('find all length', () => {
    expect(findAll('body')).toHaveLength(1)
  })

  it('find all type', () => {
    expect(Array.isArray(findAll('body'))).toBe(true)
  })

  it('find one infers the element from the selector tag', () => {
    expectTypeOf(findOne('body')).toEqualTypeOf<HTMLBodyElement | undefined>()
    expectTypeOf(findOne('form > input[name="email"]')).toEqualTypeOf<HTMLInputElement | undefined>()
    expectTypeOf(findOne('nav a.link:hover')).toEqualTypeOf<HTMLAnchorElement | undefined>()
    expectTypeOf(findOne('UL li:first-child, div')).toEqualTypeOf<HTMLElement | undefined>()
    expectTypeOf(findOne('li:has(> input.done)')).toEqualTypeOf<HTMLElement | undefined>()
    expectTypeOf(findOne('input:not(.hidden)')).toEqualTypeOf<HTMLElement | undefined>()
    expectTypeOf(findOne('ul > li:first-child')).toEqualTypeOf<HTMLLIElement | undefined>()
    expectTypeOf(findOne('svg circle')).toEqualTypeOf<SVGCircleElement | undefined>()
  })

  it('find one falls back to HTMLElement or the given type for selectors without a tag', () => {
    expectTypeOf(findOne('.card')).toEqualTypeOf<HTMLElement | undefined>()
    expectTypeOf(findOne('#main')).toEqualTypeOf<HTMLElement | undefined>()
    expectTypeOf(findDynamic).returns.toEqualTypeOf<HTMLElement | undefined>()
    expectTypeOf(findOne<HTMLInputElement>('.email')).toEqualTypeOf<HTMLInputElement | undefined>()
  })

  it('find all infers the elements from the selector tag', () => {
    expectTypeOf(findAll('ul > li')).toEqualTypeOf<HTMLLIElement[]>()
    expectTypeOf(findAll('.card')).toEqualTypeOf<HTMLElement[]>()
    expectTypeOf(findAll<HTMLInputElement>('.field')).toEqualTypeOf<HTMLInputElement[]>()
  })

  it('find one returns undefined when nothing matches', () => {
    expect(findOne('.does-not-exist')).toBeUndefined()
  })

  it('find one and find all search in the given context', () => {
    const list = document.createElement('ul')
    list.innerHTML = '<li>one</li><li>two</li>'
    expect(findOne('li', list)?.textContent).toBe('one')
    expect(findAll('li', list).map(item => item.textContent)).toStrictEqual(['one', 'two'])
  })

  it('wait to detect an existing element', async () => {
    const result = Result.unwrap(await waitToDetect('body', { wait: 60_000 }))
    expect(result.value?.tagName).toBe('BODY')
    expectTypeOf(result.value).toEqualTypeOf<HTMLBodyElement | undefined>()
  })

  it('wait to detect an element added after a few tries', async () => {
    setTimeout(() => document.body.append(div('late-comer')), 15)
    const result = Result.unwrap(await waitToDetect('.late-comer', { maxTries: 10, wait: 10 }))
    expect(result.value?.className).toBe('late-comer')
  })

  it('wait to detect gives up after the given number of tries', async () => {
    const result = Result.unwrap(await waitToDetect('.never-exists', { maxTries: 3, wait: 1 }))
    expect(result.error).toBe('stop searching after 3 tries to detect ".never-exists"')
  })

  it('wait to detect tries at least once', async () => {
    const results = await Promise.all([waitToDetect('body', { maxTries: 0 }), waitToDetect('body', { maxTries: Number.NaN })])
    expect(results.map(result => Result.unwrap(result).value?.tagName)).toStrictEqual(['BODY', 'BODY'])
  })

  it('wait to detect does not wait after its last try', async () => {
    // a sleep after the last try would outlast the test timeout
    const result = Result.unwrap(await waitToDetect('.nope-last', { maxTries: 1.5, wait: 60_000 }))
    expect(result.error).toBe('stop searching after 1 tries to detect ".nope-last"')
  })

  it('wait to detect reports the tries it really made', async () => {
    const results = await Promise.all([waitToDetect('.nope-zero', { maxTries: 0, wait: 1 }), waitToDetect('.nope-nan', { maxTries: Number.NaN, wait: 1 }), waitToDetect('.nope-half', { maxTries: 2.5, wait: 1 })])
    expect(results.map(result => Result.unwrap(result).error)).toStrictEqual([
      'stop searching after 1 tries to detect ".nope-zero"',
      'stop searching after 1 tries to detect ".nope-nan"',
      'stop searching after 2 tries to detect ".nope-half"',
    ])
  })

  it('wait to detect queries the dom exactly maxTries times', async () => {
    const spy = vi.spyOn(document, 'querySelector')
    const result = Result.unwrap(await waitToDetect('.never-exists-either', { maxTries: 4, wait: 1 }))
    const calls = spy.mock.calls.filter(([selector]) => selector === '.never-exists-either').length
    spy.mockRestore()
    expect(result.error).toBe('stop searching after 4 tries to detect ".never-exists-either"')
    expect(calls).toBe(4)
  })

  it('scroll to height', async () => {
    const element = dom('textarea')
    element.textContent = 'Hello World'
    expect(element.style.height).toBe('')
    await scrollToHeightSync(element)
  })

  it('tw returns a string A', () => {
    expectTypeOf(tw('')).toBeString()
  })

  it('tw returns a string B', () => {
    expectTypeOf(tw('text-red-500')).toBeString()
  })

  it('tw returns a string C', () => {
    expect(tw('text-blue-500 text-red-500')).toBe('text-blue-500 text-red-500')
  })

  it('tw returns a string D', () => {
    expect(tw('')).toBe('')
  })

  it('tw returns a string E', () => {
    expectTypeOf(tw``).toBeString()
  })

  it('tw returns a string F', () => {
    expectTypeOf(tw`text-red-500`).toBeString()
  })

  it('tw returns a string G', () => {
    expect(tw``).toBe('')
  })

  it('tw returns a string H', () => {
    expect(tw(['text-red-500', 'text-blue-500'])).toBe('text-red-500 text-blue-500')
  })
})
