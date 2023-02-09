# Shuutils

[![npm version](https://img.shields.io/npm/v/shuutils.svg?color=informational)](https://www.npmjs.com/package/shuutils)
[![npm monthly downloads](https://img.shields.io/npm/dm/shuutils.svg?color=informational)](https://www.npmjs.com/package/shuutils)
[![Install size](https://badgen.net/packagephobia/install/shuutils)](https://packagephobia.com/result?p=shuutils)
[![Publish size](https://img.shields.io/bundlephobia/min/shuutils?label=publish%20size)](https://bundlephobia.com/package/shuutils)
[![Package Quality](https://npm.packagequality.com/shield/shuutils.svg)](https://packagequality.com/#?package=shuutils)
[![GitHub license](https://img.shields.io/github/license/shuunen/shuutils.svg?color=informational)](https://github.com/Shuunen/shuutils/blob/master/LICENSE)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![David](https://img.shields.io/david/shuunen/shuutils.svg)](https://david-dm.org/shuunen/shuutils)
[![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/Shuunen/shuutils.svg)](https://lgtm.com/projects/g/Shuunen/shuutils)
[![Scrutinizer Score](https://scrutinizer-ci.com/g/Shuunen/shuutils/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Shuunen/shuutils)

> My collection of *mostly* pure JS utils functions :zap:

## Install

`npm install shuutils`

## Use

```js
import { getTimestamp } from 'shuutils'
// or for older js : var getTimestamp = require("shuutils").getTimestamp

console.log('Hello world, current timestamp is', getTimestamp())
```

## TODO

- [ ] use zod
- [ ] test unique mark
- [ ] add willOutputToFile option to the logger
- [ ] try to ditch the `Number(` around some constant usages like `Nb.xyz`

## Thanks

- [Box icon](https://www.iconfinder.com/icons/2123914/app_box_essential_ui_icon) by Just Icon
- [C8](https://github.com/bcoe/c8) : simple & effective cli for code coverage
- [Esbuild](https://github.com/evanw/esbuild) : an extremely fast JavaScript bundler and minifier
- [Eslint](https://eslint.org) : super tool to find & fix problems
- [Github](https://github.com) : for all their great work year after year, pushing OSS forward
- [Jakub Juszczak's article](https://hackernoon.com/how-to-publish-your-package-on-npm-7fc1f5aae600): nice article about publishing on npm
- [Josh Crowther's repo](https://github.com/jshcrowthe/howto-browser-modules): great ressource about modules
- [Repo-checker](https://github.com/Shuunen/repo-checker) : eslint cover /src code and this tool the rest ^^
- [Shields.io](https://shields.io) : for the nice badges on top of this readme
- [Shuutils](https://github.com/Shuunen/shuutils) : collection of pure JS utils
- [UvU](https://github.com/lukeed/uvu) : extremely fast and lightweight test runner for Node.js and the browser
- [Watchlist](https://github.com/lukeed/watchlist) : recursively watch a list of directories & run a command on any file system
- [Yoctocolors](https://github.com/sindresorhus/yoctocolors) : for the extra-lightweight color utilities

## Contributors ✨

Thanks goes to these wonderful people :

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://fr.linkedin.com/in/romainracamier"><img src="https://avatars.githubusercontent.com/u/439158?v=4?s=100" width="100px;" alt="Romain Racamier"/><br /><sub><b>Romain Racamier</b></sub></a><br /><a href="#infra-Shuunen" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/Shuunen/shuutils/commits?author=Shuunen" title="Tests">⚠️</a> <a href="https://github.com/Shuunen/shuutils/commits?author=Shuunen" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/babforlife"><img src="https://avatars.githubusercontent.com/u/55501953?v=4?s=100" width="100px;" alt="babforlife"/><br /><sub><b>babforlife</b></sub></a><br /><a href="https://github.com/Shuunen/shuutils/commits?author=babforlife" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jordan-boyer"><img src="https://avatars.githubusercontent.com/u/6780830?v=4?s=100" width="100px;" alt="jordan boyer"/><br /><sub><b>jordan boyer</b></sub></a><br /><a href="https://github.com/Shuunen/shuutils/commits?author=jordan-boyer" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
