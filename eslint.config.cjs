/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-expect-error missing types
const shuunen = require('eslint-plugin-shuunen')

module.exports = [
  ...shuunen.configs.base,
  ...shuunen.configs.typescript,
]
