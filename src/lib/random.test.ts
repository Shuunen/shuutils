import { randomBoolean, randomEmail, randomNumber, randomPerson, randomString } from './random.ts'

describe('random', () => {
  it('randomString A', () => {
    expect(randomString().length).toBeGreaterThan(0)
  })

  it('randomBoolean A', () => {
    expectTypeOf(randomBoolean()).toBeBoolean()
  })

  it('randomEmail A random size', () => {
    const email = randomEmail('Michael', 'Scott')
    expect(email).toContain('.scott')
  })

  it('randomEmail B short', () => {
    const email = randomEmail('Michael', 'Scott', true)
    expect(email.startsWith('m.')).toBe(true)
  })

  it('randomEmail C short no firstname', () => {
    const email = randomEmail('', 'Scott', true)
    expect(email.startsWith('scott@')).toBe(true)
  })

  it('randomPerson A', () => {
    const person = randomPerson()
    expect(person.email).toContain('.')
  })

  it('randomNumber 0 min by default', () => {
    expect(randomNumber()).toBeGreaterThanOrEqual(0)
  })

  it('randomNumber 100 max by default', () => {
    expect(randomNumber()).toBeLessThanOrEqual(100)
  })

  it('randomNumber between 22 & 122', () => {
    expect(randomNumber(22, 122)).toBeLessThanOrEqual(122)
  })

  it('randomNumber between 42 & 42', () => {
    expect(randomNumber(42, 42)).toBe(42)
  })
})
