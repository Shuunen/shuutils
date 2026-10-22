import { clone } from './object-clone.ts'
import { objectSum } from './object-sum.ts'

describe(objectSum, () => {
  const object3 = { notFun: false, 'pretty-good': true, size: 'large', superFun: true }
  const users = [
    { age: 21, name: 'John', pic: 'wow.png' },
    { age: 42, name: 'Albert' },
    { age: 22, name: 'Sam' },
    { age: 11, name: 'Birgit' },
  ]
  const object4 = { fool: { bar: 'foo', regex: /^ho\d+$/iu }, keyA: 1, keyB: 2, keyC: 3 }
  const object4ButAnotherReference = { fool: { bar: 'foo', regex: /^ho\d+$/iu }, keyA: 1, keyB: 2, keyC: 3 }
  const object4ButDeepRegexDifferent = { fool: { bar: 'foo', regex: /^oh\d+$/iu }, keyA: 1, keyB: 2, keyC: 3 }

  it('objectSum A on empty object', () => {
    expect(objectSum({})).toMatchInlineSnapshot(`2745614147`)
  })

  it('objectSum B is the same on two equally empty objects', () => {
    expect(objectSum({ name: 'john' })).toBe(objectSum(clone({ name: 'john' })))
  })

  it('objectSum C on object with numbers', () => {
    expect(objectSum({ keyA: 1, keyB: 2, keyC: 3 })).toMatchInlineSnapshot(`2822221177`)
  })

  it('objectSum D on object with a slightly different number', () => {
    expect(objectSum({ keyA: 1, keyB: 2, keyC: 4 })).toMatchInlineSnapshot(`3883285438`)
  })

  it('objectSum E on object with a slightly different key', () => {
    expect(objectSum({ keyA: 1, keyC: 3, keyD: 2 })).toMatchInlineSnapshot('1603108510')
  })

  it('objectSum F on a large object', () => {
    expect(
      objectSum({
        abyss: 1,
        backInTime: 'was a good movie',
        clearlyHugeObjectThere: 33_514_149_687,
        details: {},
        object3,
        propE: 5,
        propF: 6,
        propG: 7,
        propH: 8,
        propI: 9,
        propJ: 10,
        users,
      }),
    ).toMatchInlineSnapshot(`3418764930`)
  })

  it('objectSum G is the same on two equals objects', () => {
    expect(objectSum(object3)).toBe(objectSum(clone(object3)))
  })

  it('objectSum H is the same on two equals objects with nested objects', () => {
    expect(objectSum(object4)).toBe(objectSum(object4ButAnotherReference))
  })

  it('objectSum I is different with a deep slight modification', () => {
    expect(objectSum(object4)).not.toBe(objectSum(object4ButDeepRegexDifferent))
  })

  it('objectSum J changes depending on key order', () => {
    // oxlint-disable-next-line sort-keys -- the differing key order is the point of this test
    expect(objectSum({ keyA: 1, keyB: 2, keyC: 3 })).not.toBe(objectSum({ keyC: 3, keyA: 1, keyB: 2 }))
  })

  it('objectSum K same when key sorted', () => {
    // oxlint-disable-next-line sort-keys -- the differing key order is the point of this test
    expect(objectSum({ keyA: 1, keyB: 2, keyC: 3 }, { sortKeys: true })).toBe(objectSum({ keyC: 3, keyA: 1, keyB: 2 }, { sortKeys: true }))
  })
})
