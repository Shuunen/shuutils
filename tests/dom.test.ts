import { ok, strictEqual as equal } from 'assert'
import { css, div, dom, em, h1, h2, h3, image, link, p, small, strong } from '../src'

describe('dom', function () {

  it('custom type dom element with no classes', function () {
    const el = dom('article')
    equal(el.tagName.toLowerCase(), 'article')
    equal(el.className, '')
  })

  it('custom type dom element with classes', function () {
    const el = dom('strong', 'important important--stuff')
    equal(el.tagName.toLowerCase(), 'strong')
    equal(el.className, 'important important--stuff')
    ok(el.classList.contains('important--stuff'))
  })

  it('custom type dom element with classes & text content', function () {
    const el = dom('i', 'italic', 'Hello John Cena')
    equal(el.textContent, 'Hello John Cena')
    equal(el.innerHTML, 'Hello John Cena')
  })

  it('custom type dom element with classes & html content', function () {
    const el = dom('i', 'italic', '<p>Hello John Cena</p>')
    equal(el.textContent, 'Hello John Cena')
    equal(el.tagName.toLowerCase(), 'i')
    equal(el.innerHTML, '<p>Hello John Cena</p>')
  })

  it('image', function () {
    const el = image('profile', 'https://cdn.com/image.jpg', 'profile picture')
    equal(el.alt, 'profile picture')
    equal(el.tagName.toLowerCase(), 'img')
    equal(el.src, 'https://cdn.com/image.jpg')
  })

  it('link', function () {
    const el = link('link', 'go to home page', '#home')
    equal(el.tagName.toLowerCase(), 'a')
    equal(el.textContent, 'go to home page')
    ok(el.href.includes('#home')) // jsdom return "about:blank#home" for el.href...
  })

  it('link that open in a new tab', function () {
    const el = link('link', 'go to external page', 'https://duckduckgo.com/', true)
    equal(el.href, 'https://duckduckgo.com/')
    equal(el.textContent, 'go to external page')
    equal(el.target, '_blank')
  })

  it('basics', function () {
    const funcs = [p, strong, em, small, h1, h2, h3, div]
    funcs.forEach(func => {
      const { name } = func
      const el = func(name)
      equal(el.tagName.toLowerCase(), name)
      equal(el.textContent, '')
      ok(el.classList.contains(name))
      const elContent = func(name, `I really like guacamole with ${name}`)
      equal(elContent.tagName.toLowerCase(), name)
      equal(elContent.textContent, `I really like guacamole with ${name}`)
    })
  })

  it('css link', function () {
    const el = css('https://cdn.net/style.css')
    equal(el.href, 'https://cdn.net/style.css')
    equal(el.rel, 'stylesheet')
    equal(el.type, 'text/css')
  })

})
