import { expect, it } from 'vitest'
import { expectEqualTypes, expectType } from '../src'

interface Person {
  name: string
  age: number
}

it('expectType A valid', () => {
  expect(expectType<number>(12)).toBe(true)
})

it('expectType B invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectType<number>('12')).toBe(true)
})

it('expectType C complex', () => {
  expect(expectType<Person>({ name: 'John', age: 42 })).toBe(true)
})

it('expectType D complex invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectType<Person>({ name: 'John', age: '42' })).toBe(true)
})

it('expectEqualTypes A inferred valid', () => {
  expect(expectEqualTypes(12, 34)).toBe(true)
})

it('expectEqualTypes B inferred invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes(12, '12')).toBe(true)
})

it('expectEqualTypes C inferred complex valid', () => {
  expect(expectEqualTypes({ name: 'John', age: 42 }, { name: 'Johnny', age: 6 })).toBe(true)
})

it('expectEqualTypes D inferred complex invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes({ name: 'John', age: 42 }, { name: 'Johnny', age: '66' })).toBe(true)
})

it('expectEqualTypes E specified valid', () => {
  expect(expectEqualTypes<number, number>(12, 35)).toBe(true)
})

it('expectEqualTypes F specified invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes<number, number>(12, '41')).toBe(true)
})

it('expectEqualTypes G specified complex valid', () => {
  expect(expectEqualTypes<Person, Person>({ name: 'John', age: 42 }, { name: 'Johnny', age: 31 })).toBe(true)
})

it('expectEqualTypes H specified complex invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes<Person, Person>({ name: 'John', age: 42 }, { name: 'Johnny', age: '31' })).toBe(true)
})

it('expectEqualTypes I specified type mismatch', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes<Person, string>({ name: 'John', age: 42 }, 'Johnny')).toBe(true)
})
