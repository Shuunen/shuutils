/* eslint-disable jsdoc/require-jsdoc */
import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { check, createState, storage } from '../src'

const { state: stateA, watchState: watchStateA } = createState({ name: 'Michael', age: 30 })

check('state A initial data', stateA, { name: 'Michael', age: 30 })

test('state A name change', function () {
  stateA.name = 'John'
  equal(stateA.name, 'John')
})

test('state A watch callback', function () {
  let callbackCalls = 0
  function callback () {
    callbackCalls += 1
  }
  watchStateA('name', callback)
  equal(callbackCalls, 0, 'callback not called yet')
  stateA.name = 'Martin'
  equal(callbackCalls, 1, 'callback called once')
  stateA.name = 'Josh'
  equal(callbackCalls, 2, 'callback called twice')
  stateA.age = 33
  equal(callbackCalls, 2, 'callback not called when age changed')
})

test('state B with storage and specific keys to store', function () {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/naming-convention, camelcase
  storage.media = { stateB_age: 12, stateB_excluded: ':(' } as unknown as Storage
  storage.prefix = 'stateB_'
  const { state: stateB } = createState({ name: 'Clara', age: 42, excluded: ':)' }, storage, ['name', 'age'])
  equal(stateB.name, 'Clara', 'name loaded from initial data because not in storage')
  equal(stateB.age, 12, 'age loaded from storage that takes precedence over initial data because it is in the sync props')
  equal(stateB.excluded, ':)', 'excluded loaded from initial data event if present in storage, because it was not in the synced props')
  stateB.name = 'John'
  equal(stateB.name, 'John', 'name changed in state')
  equal(storage.media['stateB_name'], 'John', 'name synced in storage')
})

test('state C with storage and all keys stored by default', function () {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/naming-convention, camelcase
  storage.media = { stateC_age: 12, stateC_included: ':D' } as unknown as Storage
  storage.prefix = 'stateC_'
  const { state: stateC } = createState({ age: 42, included: 'but im gonna be ignored :(' }, storage)
  equal(stateC.age, 12, 'age loaded from storage that takes precedence over initial data because it is in the sync props')
  equal(stateC.included, ':D', 'included loaded from storage that takes precedence over initial data because it is in the sync props')
  stateC.age = 14
  equal(stateC.age, 14, 'age changed in state')
  equal(storage.get('age'), 14, 'age synced in storage')
})

test('state D multiple watch', function () {
  let callbackCalls = 0
  function callbackA () {
    callbackCalls += 1
  }
  watchStateA(['name', 'age'], callbackA)
  equal(callbackCalls, 0, 'callback A not called yet')
  stateA.name = 'Martin'
  equal(callbackCalls, 1, 'callback A called once')
  stateA.age = 33
  equal(callbackCalls, 2, 'callback A called twice')
})

test('state E watch all', function () {
  let callbackCalls = 0
  let callbackKey = ''
  function callbackB (updatedKey: string) {
    callbackCalls += 1
    callbackKey = updatedKey
  }
  watchStateA('*', callbackB)
  equal(callbackCalls, 0, 'callback B not called yet')
  stateA.name = 'Martin'
  equal(callbackCalls, 1, 'callback B called once')
  equal(callbackKey, 'name', 'callback B called with name key')
  stateA.age = 33
  equal(callbackCalls, 2, 'callback B called twice')
  equal(callbackKey, 'age', 'callback B called with age key')
})

test.run()
