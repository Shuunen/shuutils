import { shuffleArray } from './array-shuffle'

describe('array-shuffle', () => {
  it('shuffleArray A does not mutate the original array', () => {
    const elements = ['damn', 'this', 'test', 'is', 'crazy']
    shuffleArray(elements)
    expect(elements).toStrictEqual(['damn', 'this', 'test', 'is', 'crazy'])
  })

  it('shuffleArray B keeps the same length', () => {
    expect(shuffleArray([1, 2, 3, 4, 5])).toHaveLength(5)
  })

  it('shuffleArray C keeps the same members', () => {
    expect(shuffleArray([1, 2, 3, 4, 5]).sort((a, b) => a - b)).toStrictEqual([1, 2, 3, 4, 5])
  })

  it('shuffleArray D on an empty array', () => {
    expect(shuffleArray([])).toStrictEqual([])
  })

  it('shuffleArray E on a single item array', () => {
    expect(shuffleArray(['solo'])).toStrictEqual(['solo'])
  })
})
