import { memoize } from './memoize.ts'

let addCalls = 0

/**
 * Add two numbers
 * @param numberA the first number
 * @param numberB the second number
 * @returns the sum of the two numbers
 */
function add(numberA: number, numberB: number) {
  addCalls += 1
  return numberA + numberB
}

const memoizedAdd = memoize(add)

describe('memoize', () => {
  it('memoize A testing non memoized function', () => {
    addCalls = 0
    expect(addCalls).toBe(0)
    expect(add(1, 2)).toBe(3)
    expect(addCalls).toBe(1)
    expect(add(1, 2)).toBe(3)
    expect(addCalls).toBe(2)
  })

  it('memoize B testing memoized function', () => {
    addCalls = 0
    // each pair is a result followed by the number of real calls so far
    const steps = [memoizedAdd(1, 2), addCalls, memoizedAdd(1, 2), addCalls, memoizedAdd(2, 1), addCalls, memoizedAdd(1, 2), addCalls, memoizedAdd(2, 1), addCalls, memoizedAdd(1.5, 1.5), addCalls]
    expect(steps).toStrictEqual([3, 1, 3, 1, 3, 2, 3, 2, 3, 2, 3, 3])
  })

  it('memoize C invalid callback given', () => {
    expect(() => memoize(1 as unknown as () => void)).toThrowErrorMatchingInlineSnapshot(`[TypeError: memoize callback parameter should be a function]`)
  })

  type Parent = { age?: number; firstName: string; lastName: string }

  let childNameCalls = 0

  /**
   * Calculate the full name of a child
   * @param firstName the first name of the child
   * @param parentA the first parent
   * @param parentB the second parent
   * @returns the full name of the child
   */
  function childName(firstName: string, parentA: Readonly<Parent>, parentB: Readonly<Parent>) {
    childNameCalls += 1
    return `${firstName} ${parentA.lastName} ${parentB.lastName}`
  }

  const memoizedChildName = memoize(childName)

  it('memoize D testing memoized function with objects', () => {
    childNameCalls = 0
    const parentA = { age: 33, firstName: 'John', lastName: 'Doe' }
    const parentB = { firstName: 'Jane', lastName: 'Mac' }
    // each pair is a result followed by the number of real calls so far, changing a nested value busts the cache
    const steps = [memoizedChildName('Michael', parentA, parentB), childNameCalls, memoizedChildName('Michael', parentA, parentB), childNameCalls]
    parentA.age = 34
    steps.push(memoizedChildName('Michael', parentA, parentB), childNameCalls)
    expect(steps).toStrictEqual(['Michael Doe Mac', 1, 'Michael Doe Mac', 1, 'Michael Doe Mac', 2])
  })

  it('memoize E : return types', () => {
    expectTypeOf(add(1, 2)).toEqualTypeOf(memoizedAdd(1, 2))
  })
})
