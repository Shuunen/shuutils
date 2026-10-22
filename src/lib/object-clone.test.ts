import { clone } from './object-clone.ts'
import { objectEqual } from './object-equal.ts'
import { objectSum } from './object-sum.ts'

describe(clone, () => {
  const person = {
    age: 21,
    details: { dateOfBirth: new Date('2001-12-22'), favouriteFood: 'sushi' },
    name: 'John',
    nameRegex: /^jo/iu,
    nameValid: true,
    nameValidator: (input: string) => input.length > 3,
  }
  const personClone = clone(person)
  const personCloneModified = clone(person)
  personCloneModified.age = 42

  it('clone A record', () => {
    expect(personCloneModified.age).toBe(42)
  })

  it('clone B record does not affect the original one', () => {
    expect(person.age).toBe(21)
  })

  const persons = ['John', 'Fanny']
  const personsCopy = clone(persons)
  personsCopy[1] = 'Bob'

  it('clone C array', () => {
    expect(personsCopy[1]).toBe('Bob')
  })

  it('clone D array does not affect the original one', () => {
    expect(persons[1]).toBe('Fanny')
  })

  it('clone E original and clone are have the same objectSum', () => {
    expect(objectSum(person)).toBe(objectSum(personClone))
  })

  it('clone F original and clone are equals via objectEqual', () => {
    expect(objectEqual(person, personClone)).toBe(true)
  })

  it('clone G two clones are equals via objectEqual', () => {
    expect(objectEqual(clone(person), clone(person))).toBe(true)
  })

  it('clone H cloned values keep their type', () => {
    const cloned = clone(person)
    expectTypeOf(cloned.nameValidator).toBeFunction()
    expectTypeOf(cloned.nameRegex).toBeObject()
    expect(cloned.nameRegex instanceof RegExp).toBe(true)
    expectTypeOf(cloned.details.dateOfBirth).toBeObject()
    expect(cloned.details.dateOfBirth instanceof Date).toBe(true)
  })

  it('clone J never runs a marker-shaped value', () => {
    const payload = JSON.parse('{"__function__":"(() => { globalThis.clonePwned = true; return 0 })()"}') as unknown
    const cloned = clone({ onClick: () => 1, payload })
    expect(cloned.payload).toStrictEqual({ __function__: '(() => { globalThis.clonePwned = true; return 0 })()' })
    expect('clonePwned' in globalThis).toBe(false)
  })

  it('clone K keeps the same functions, method shorthand and circular references', () => {
    let count = 0
    const source: Record<string, unknown> = {
      increment() {
        count += 1
        return count
      },
    }
    source.self = source
    const cloned = clone(source)
    expect([cloned.increment === source.increment, cloned.self === cloned, cloned === source]).toStrictEqual([true, true, false])
  })

  it('clone L copies the arrays, maps and class instances next to a function', () => {
    class User {
      public name = 'a'
      public greet = () => this.name
    }
    const date = new Date('2001-12-22')
    const list: unknown[] = [1, { count: 1 }]
    list.length = 4
    const source = { dates: [date, date], list, map: new Map([['run', () => 2]]), onClick: () => 1, user: new User() }
    const cloned = clone(source)
    cloned.user.name = 'b'
    expect([source.user.name, cloned.user instanceof User, cloned.user.greet === source.user.greet]).toStrictEqual(['a', true, true])
    expect([cloned.list === source.list, cloned.list[1] === source.list[1], cloned.list.length, 2 in cloned.list]).toStrictEqual([false, false, 4, false])
    expect([cloned.map === source.map, cloned.map.get('run') === source.map.get('run'), cloned.dates[0] === cloned.dates[1], cloned.dates[0] === date]).toStrictEqual([false, true, true, false])
  })

  it('clone M keeps an own __proto__ key as a key', () => {
    const source = { onClick: () => 1, payload: JSON.parse('{"__proto__":{"isAdmin":true}}') as Record<string, unknown> }
    const cloned = clone(source)
    expect([Object.keys(cloned.payload), 'isAdmin' in cloned.payload]).toStrictEqual([['__proto__'], false])
  })

  // Value: protects=a Set next to a function is a new Set with deep copied items and shared refs kept; fails_when=the Set is shared, emptied or its items not copied; why_new=only Map was covered; seam=none; no_claim=WeakSet
  it('clone N copies a set next to a function, keeping a shared item shared', () => {
    const item = { count: 1 }
    const source = { items: new Set([item, 'a']), onClick: () => 1, same: item }
    const cloned = clone(source)
    const [first] = cloned.items
    expect([cloned.items === source.items, cloned.items instanceof Set, cloned.items.size, cloned.items.has('a')]).toStrictEqual([false, true, 2, true])
    expect([first === item, first === cloned.same, first]).toStrictEqual([false, true, { count: 1 }])
  })

  it('clone I debug', () => {
    expect({ person, personCopy: personCloneModified }).toMatchSnapshot()
  })
})
