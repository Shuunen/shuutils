/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Check provided type against parameter
 * @param _thing type to compare
 * @returns true
 * @example checkType<string>('hello')
 * checkType<PersonModel>({ name: 'John' })
 * checkType<PersonModel>(await getPerson())
 */
export function expectType<Type> (_thing: Type) { return true }

/**
 * Check two types, you can provide the type or let TypeScript infer them
 * @param _thingA first type to compare
 * @param _thingB second type to compare
 * @returns true
 * @example expectEqualTypes(funcA(), funcB())
 * expectEqualTypes(await funcA(), await funcB())
 * expectEqualTypes<PersonModel>({ name: 'John' }, { name: 'John' })
 * expectEqualTypes<PersonModel>({ name: 'John' }, { name: 'John', age: 42 })
 */
export function expectEqualTypes<TypeA, TypeB extends TypeA> (_thingA: TypeA, _thingB: TypeB) { return true }
