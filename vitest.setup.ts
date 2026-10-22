import { existsSync } from 'node:fs'
import { build } from 'tsdown'

export const setup = async () => {
  process.env.TZ = 'UTC'
  // some tests check the published bundle, build it when running vitest directly on a fresh clone
  if (!existsSync('dist/shuutils.js')) await build({ logLevel: 'warn' })
}
