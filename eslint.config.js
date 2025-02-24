import shuunen from 'eslint-plugin-shuunen'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...shuunen.configs.base,
  ...shuunen.configs.typescript,
  {
    ignores: ['src/resultx.ts'],
    name: 'shuutils-ignores',
  },
]

export default config
