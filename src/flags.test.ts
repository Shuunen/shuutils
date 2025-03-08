/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { afterEach, describe, expect, it } from 'bun:test'
import { hasOption } from './flags'

// eslint-disable-next-line unicorn/prefer-structured-clone
const initialProcess = JSON.parse(JSON.stringify(process))

describe('flags', () => {
  afterEach(() => {
    process.argv = initialProcess.argv
    process.env = initialProcess.env
  })

  it('hasOption A has process', () => {
    expect(typeof process).toMatchInlineSnapshot(`"object"`)
  })

  it('hasOption B without argv & without env', () => {
    // @ts-expect-error type issue
    process.argv = undefined
    // @ts-expect-error type issue
    process.env = undefined
    expect(hasOption('verbose')).toMatchInlineSnapshot(`false`)
  })

  it('hasOption C with argv & without env', () => {
    process.argv = ['--verbose']
    // @ts-expect-error type issue
    process.env = undefined
    expect(hasOption('verbose')).toMatchInlineSnapshot(`true`)
  })

  it('hasOption D without argv & with env', () => {
    process.argv = []
    process.env = { verbose: 'true' }
    expect(hasOption('verbose')).toMatchInlineSnapshot(`true`)
  })
})
