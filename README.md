# Shuutils

[![GitHub license](https://img.shields.io/github/license/shuunen/shuutils.svg?color=informational)](https://github.com/Shuunen/shuutils/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/shuutils.svg?color=informational)](https://www.npmjs.com/package/shuutils)
[![npm monthly downloads](https://img.shields.io/npm/dm/shuutils.svg?color=informational)](https://www.npmjs.com/package/shuutils)
[![Install size](https://badgen.net/packagephobia/install/shuutils)](https://packagephobia.com/result?p=shuutils)
[![Publish size](https://img.shields.io/bundlephobia/min/shuutils?label=publish%20size)](https://bundlephobia.com/package/shuutils)
[![Package Quality](https://npm.packagequality.com/shield/shuutils.svg)](https://packagequality.com/#?package=shuutils)
[![Visitors](https://hits.sh/github.com/Shuunen/shuutils.svg?label=visitors&color=informational)](https://hits.sh/github.com/Shuunen/shuutils/)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

> My collection of _mostly_ pure JS utils functions :zap:

## Install

`npm install shuutils`

## Use

```js
import { getTimestamp } from 'shuutils'
// or for older js : var getTimestamp = require("shuutils").getTimestamp

console.log('Hello world, current timestamp is', getTimestamp())
```

## Migrating from v10

`v11` removes a few top-level exports. The functionality is still there, just reached differently :

| Removed in v11                   | Use instead                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| `ok`, `err`, `unwrap`, `trySafe` | `Result.ok`, `Result.err`, `Result.unwrap`, `Result.trySafe` |
| `expectType`, `expectEqualTypes` | dropped, use your test runner's own type assertions          |
| `cn`, `genClass`                 | dropped                                                      |
| `access`, `jsonStartRegex`       | dropped                                                      |

Behavior changes :

- `sanitize` and `slugify` now treat `.` as a separator, so `slugify('example.com')` returns `example-com` where `v10` returned `examplecom`

## Thanks

- [Angus Croll](https://github.com/angus-c/just) : for the inspiration of some dependency free functions
- [Box icon](https://www.iconfinder.com/icons/2123914/app_box_essential_ui_icon) : nice icon
- [Boxy Svg](https://boxy-svg.com) : simple & effective svg editor
- [Bun](https://bun.sh) : super fast runtime for JavaScript and TypeScript
- [Github](https://github.com) : for all their great work year after year, pushing OSS forward
- [Knip](https://github.com/webpro/knip) : super tool to find & fix problems
- [Oxc](https://oxc.rs) : a lovely super-fast collection of JavaScript tools written in Rust
- [Oxlint](https://oxc.rs) : super fast linter and formatter
- [Jakub Juszczak's article](https://hackernoon.com/how-to-publish-your-package-on-npm-7fc1f5aae600): nice article about publishing on npm
- [Josh Crowther's repo](https://github.com/jshcrowthe/howto-browser-modules): great ressource about modules
- [Shields.io](https://shields.io) : for the nice badges on top of this readme
- [Svg Omg](https://jakearchibald.github.io/svgomg/) : the great king of svg file size reduction
- [Tsdown](https://tsdown.dev) : elegant library bundler powered by rolldown <3
- [V8](https://github.com/demurgos/v8-coverage) : simple & effective cli for code coverage
- [Vite](https://github.com/vitejs/vite) : super fast frontend tooling
- [Vitest](https://github.com/vitest-dev/vitest) : super fast vite-native testing framework
- [Yoctocolors](https://github.com/sindresorhus/yoctocolors) : for the extra-lightweight color utilities

## Contributors ✨

Thanks goes to these wonderful people :

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://fr.linkedin.com/in/romain-racamier"><img src="https://avatars.githubusercontent.com/u/439158?v=4?s=100" width="100px;" alt="Romain Racamier"/><br /><sub><b>Romain Racamier</b></sub></a><br /><a href="#infra-Shuunen" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/Shuunen/shuutils/commits?author=Shuunen" title="Tests">⚠️</a> <a href="https://github.com/Shuunen/shuutils/commits?author=Shuunen" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/babforlife"><img src="https://avatars.githubusercontent.com/u/55501953?v=4?s=100" width="100px;" alt="babforlife"/><br /><sub><b>babforlife</b></sub></a><br /><a href="https://github.com/Shuunen/shuutils/commits?author=babforlife" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jordan-boyer"><img src="https://avatars.githubusercontent.com/u/6780830?v=4?s=100" width="100px;" alt="jordan boyer"/><br /><sub><b>jordan boyer</b></sub></a><br /><a href="https://github.com/Shuunen/shuutils/commits?author=jordan-boyer" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
