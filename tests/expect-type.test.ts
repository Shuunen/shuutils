import { expect, it } from 'vitest'
import { expectEqualTypes, expectType } from '../src'

interface Person {
  name: string
  age: number
}

it('expectType A valid', () => {
  expect(expectType<number>(12)).toBeTruthy()
})

it('expectType B invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectType<number>('12')).toBeTruthy()
})

it('expectType C complex', () => {
  expect(expectType<Person>({ name: 'John', age: 42 })).toBeTruthy()
})

it('expectType D complex invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectType<Person>({ name: 'John', age: '42' })).toBeTruthy()
})

it('expectEqualTypes A inferred valid', () => {
  expect(expectEqualTypes(12, 34)).toBeTruthy()
})

it('expectEqualTypes B inferred invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes(12, '12')).toBeTruthy()
})

it('expectEqualTypes C inferred complex valid', () => {
  expect(expectEqualTypes({ name: 'John', age: 42 }, { name: 'Johnny', age: 6 })).toBeTruthy()
})

it('expectEqualTypes D inferred complex invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes({ name: 'John', age: 42 }, { name: 'Johnny', age: '66' })).toBeTruthy()
})

it('expectEqualTypes E specified valid', () => {
  expect(expectEqualTypes<number, number>(12, 35)).toBeTruthy()
})

it('expectEqualTypes F specified invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes<number, number>(12, '41')).toBeTruthy()
})

it('expectEqualTypes G specified complex valid', () => {
  expect(expectEqualTypes<Person, Person>({ name: 'John', age: 42 }, { name: 'Johnny', age: 31 })).toBeTruthy()
})

it('expectEqualTypes H specified complex invalid', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes<Person, Person>({ name: 'John', age: 42 }, { name: 'Johnny', age: '31' })).toBeTruthy()
})

it('expectEqualTypes I specified type mismatch', () => {
  // @ts-expect-error invalid type here
  expect(expectEqualTypes<Person, string>({ name: 'John', age: 42 }, 'Johnny')).toBeTruthy()
})
