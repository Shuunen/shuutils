import { existsSync } from 'node:fs'
import { build } from 'tsdown'

// oxlint-disable-next-line import/prefer-default-export
export const setup = async () => {
  process.env.TZ = 'UTC'
  // some tests check the published bundle, build it when running vitest directly on a fresh clone
  if (!existsSync('dist/shuutils.js') || !existsSync('dist/shuutils.cjs')) await build({ logLevel: 'warn' })
}
