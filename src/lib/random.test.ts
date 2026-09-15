import { randomBoolean, randomEmail, randomNumber, randomPerson, randomString } from './random'

test('randomString A', () => {
  expect(randomString().length).toBeGreaterThan(0)
})

test('randomBoolean A', () => {
  expectTypeOf(randomBoolean()).toBeBoolean()
})

test('randomEmail A random size', () => {
  const email = randomEmail('Michael', 'Scott')
  expect(email).toContain('.scott')
})

test('randomEmail B short', () => {
  const email = randomEmail('Michael', 'Scott', true)
  expect(email.startsWith('m.')).toBe(true)
})

test('randomEmail C short no firstname', () => {
  const email = randomEmail('', 'Scott', true)
  expect(email.startsWith('scott@')).toBe(true)
})

test('randomPerson A', () => {
  const person = randomPerson()
  expect(person.email).toContain('.')
})

test('randomNumber 0 min by default', () => {
  expect(randomNumber()).toBeGreaterThanOrEqual(0)
})

test('randomNumber 100 max by default', () => {
  expect(randomNumber()).toBeLessThanOrEqual(100)
})

test('randomNumber between 22 & 122', () => {
  expect(randomNumber(22, 122)).toBeLessThanOrEqual(122)
})

test('randomNumber between 42 & 42', () => {
  expect(randomNumber(42, 42)).toBe(42)
})
