import { ok, strictEqual as equal } from 'assert'
import { test } from 'uvu'
import { a, css, div, dom, em, findAll, findOne, h1, h2, h3, icon, image, img, link, p, small, strong, text, waitToDetect } from '../src'
import { check } from './utils'

test('custom type dom element with no classes', function () {
  const element = dom('article')
  equal(element.tagName.toLowerCase(), 'article')
  equal(element.className, '')
})

test('custom type dom element with classes', function () {
  const element = dom('strong', 'important important--stuff')
  equal(element.tagName.toLowerCase(), 'strong')
  equal(element.className, 'important important--stuff')
  ok(element.classList.contains('important--stuff'))
})

test('custom type dom element with classes & text content', function () {
  const element = dom('i', 'italic', 'Hello John Cena')
  equal(element.textContent, 'Hello John Cena')
  equal(element.innerHTML, 'Hello John Cena')
})

test('custom type dom element with classes & html content', function () {
  const element = dom('i', 'italic', '<p>Hello John Cena</p>')
  equal(element.textContent, 'Hello John Cena')
  equal(element.tagName.toLowerCase(), 'i')
  equal(element.innerHTML, '<p>Hello John Cena</p>')
})

test('custom type dom element with classes & dom element content', function () {
  const element = dom('i', 'italic', p('pizza', 'John Pepe'))
  equal(element.textContent, 'John Pepe')
  equal(element.tagName.toLowerCase(), 'i')
  equal(element.innerHTML, '<p class="pizza">John Pepe</p>')
})

test('image', function () {
  const element = image('profile', 'https://cdn.com/image.jpg', 'profile picture')
  equal(element.alt, 'profile picture')
  equal(element.tagName.toLowerCase(), 'img')
  equal(element.src, 'https://cdn.com/image.jpg')
})

test('img', function () {
  const element = img('profile-short', 'https://cdn.com/image-short.jpg', 'profile-short picture')
  equal(element.alt, 'profile-short picture')
  equal(element.tagName.toLowerCase(), 'img')
  equal(element.src, 'https://cdn.com/image-short.jpg')
})

test('icon', function () {
  const element = icon('fas fa-profile')
  equal(element.className, 'icon fas fa-profile')
})

test('link', function () {
  const element = link('link', 'go to home page', '#home')
  equal(element.tagName.toLowerCase(), 'a')
  equal(element.textContent, 'go to home page')
  ok(element.href.includes('#home')) // jsdom return "about:blank#home" for el.href...
})

test('link that open in a new tab', function () {
  const element = a('link', 'go to external page', 'https://duckduckgo.com/', true)
  equal(element.href, 'https://duckduckgo.com/')
  equal(element.textContent, 'go to external page')
  equal(element.target, '_blank')
})

test('basics', function () {
  const funcs = [p, text, strong, em, small, h1, h2, h3, div]
  funcs.forEach(function_ => {
    const { name } = function_
    const element = function_(name)
    equal(element.tagName.toLowerCase(), name)
    equal(element.textContent, '')
    ok(element.classList.contains(name))
    const elementContent = function_(name, `I really like guacamole with ${name}`)
    equal(elementContent.tagName.toLowerCase(), name)
    equal(elementContent.textContent, `I really like guacamole with ${name}`)
  })
})

test('css link', function () {
  const element = css('https://cdn.net/style.css')
  equal(element.href, 'https://cdn.net/style.css')
  equal(element.rel, 'stylesheet')
  equal(element.type, 'text/css')
})

test('dive div in a dave div has Life in a div', function () {
  const element = div('dave', div('dive', 'Life in a div'))
  equal(element.tagName.toLowerCase(), 'div')
  equal(element.innerHTML, '<div class="dive">Life in a div</div>')
})

check('find one', findOne('body').tagName, 'BODY')
check('find all length', findAll('body').length, 1)
check('find all type', Array.isArray(findAll('body')), true)

test('wait to detect an existing element', async function () {
  const element = await waitToDetect('body', 10)
  equal(element.tagName, 'BODY')
})
test('wait to detect a non-existing element', async function () {
  const element = await waitToDetect('.not-existing', 10)
  equal(element, undefined)
})

test.run()
