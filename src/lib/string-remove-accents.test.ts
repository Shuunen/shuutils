import { removeAccents } from './string-remove-accents'

describe('string-remove-accents', () => {
  it('removeAccents A basic accents', () => {
    expect(removeAccents('éàù')).toBe('eau')
  })

  it('removeAccents B a full sentence', () => {
    expect(removeAccents('Où est passé le café ?')).toBe('Ou est passe le cafe ?')
  })

  it('removeAccents C leaves a plain string untouched', () => {
    expect(removeAccents('hello world')).toBe('hello world')
  })

  it('removeAccents D an empty string', () => {
    expect(removeAccents('')).toBe('')
  })

  it('removeAccents E uppercase accents', () => {
    expect(removeAccents('ÉÀÙ')).toBe('EAU')
  })
})
