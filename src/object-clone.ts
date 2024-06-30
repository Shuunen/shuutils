import { objectDeserialize, objectSerialize } from './object-serializer'
import type { Mutable } from './types'

/**
 * Return a deep copy of an object or array
 * @param object like : `{ name : "Pine" }`
 * @returns item copy like : `{ name : "Pine" }`
 */
export function clone<Type>(object: Readonly<Type>) {
  try {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return structuredClone(object) as Mutable<Type>
  } catch {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return objectDeserialize(objectSerialize(object)) as Mutable<Type>
  }
}
