import { check, checksRun, storage } from '../src'

const mock = {} as Storage
type User = { name: string; age: number }
const key = 'Michael'

check('storage has no value for key', storage.has(key, mock), false)
check('storage set string value for key', storage.set(key, 'Flax', mock), 'Flax')
check('storage has string value for key', storage.has(key, mock), true)

check('storage set object value for key', storage.set(key, { name: 'Michael', age: 30 }, mock), { name: 'Michael', age: 30 })
check('storage get object value for key', storage.get<User>(key, mock), { name: 'Michael', age: 30 })

check('storage set number value for key', storage.set(key, 30, mock), 30)
check('storage get number value for key', storage.get<number>(key, mock), 30)

check('storage set boolean value for key', storage.set(key, true, mock), true)
check('storage get boolean value for key', storage.get<boolean>(key, mock), true)

check('storage set array value for key', storage.set(key, [1, 2, 3], mock), [1, 2, 3])
check('storage get array value for key', storage.get<number[]>(key, mock), [1, 2, 3])

check('storage clear value for key', storage.clear(key, mock))

check('storage get return undefined when key is not found', storage.get<User>('John', mock))

checksRun()
