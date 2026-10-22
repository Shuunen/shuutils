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
// or in commonjs, on node >=22.12 : const { getTimestamp } = require('shuutils')

console.log('Hello world, current timestamp is', getTimestamp())
```

## Bundler plugin

`shuutils/plugins` exposes `uniqueMark`, a plugin for vite, rolldown, rollup and tsdown that injects a mark like `4.2.0 - 123abc45 - 01/01/2021 12:00:00` (package.json version, git commit, build date) in the built files :

```js
import { uniqueMark } from 'shuutils/plugins'

export default defineConfig({
  plugins: [uniqueMark()],
})
```

Put one of these placeholders in your sources : `__unique-mark__`, `{{ unique-mark }}`, `<span id="unique-mark"></span>` or `<meta name="unique-mark" content="">`.
By default, js and css files also get a `/* unique-mark : ... */` first line, use `uniqueMark({ banner: false })` to skip it, or `uniqueMark({ placeholder: 'my-mark' })` to use another placeholder.
In JSX, keep the placeholder element empty, like `<span id="unique-mark" />` : text inside an element that also has an object or template literal prop, like `style={{ ... }}`, keeps its text instead of the mark.
List `uniqueMark()` before any plugin that hashes the built files, like a subresource integrity plugin, so the hashes match the marked content.

The same marking is available after the build through the `unique-mark` cli : `npx unique-mark dist`, it targets every js, css and html file in a folder, or a glob like `"dist/*.js"`, skips files that are not utf8 text, and fails when no mark was injected.

## Migrating from v11

`v12` is esm only and requires Node `>=22.12.0`, where `require('shuutils')` still works through `require(esm)`.
Tools that replace node's own `require`, like Jest in its default commonjs mode, cannot load it : switch them to esm mode, or move to Vitest.

Boolean flags moved into an options object with plain names :

| `v11`                                                | `v12`                                                                            |
| ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| `objectSerialize(object, true, true)`                | `objectSerialize(object, { sortKeys: true, indent: true })`                      |
| `objectEqual(a, b, true)`, `objectSum(object, true)` | `objectEqual(a, b, { sortKeys: true })`, `objectSum(object, { sortKeys: true })` |
| `stringify(data, true)`                              | `stringify(data, { indent: true })`                                              |
| `readableTime(ms, false)`                            | `readableTime(ms, { short: true })`                                              |
| `dateToIsoString(date, true)`                        | `dateToIsoString(date, { removeTimezone: true })`                                |
| `sanitize(text, false)`                              | `sanitize(text, { lowercase: false })`                                           |
| `capitalize(text, true)`                             | `capitalize(text, { lowercaseRest: true })`                                      |
| `link(classes, content, href, true)`                 | `link(classes, content, href, { newTab: true })`                                 |
| `copyToClipboard(stuff, true)`                       | `copyToClipboard(stuff, { log: true })`                                          |
| `readClipboard(true)`                                | `readClipboard({ log: true })`                                                   |
| `waitToDetect(selector, 200, 0, 10)`                 | `waitToDetect(selector, { wait: 200, maxTries: 10 })`                            |
| `createAnalytics({ willLog: true, willPile: true })` | `createAnalytics({ log: true, pile: true })`                                     |

A `v11` call that still passes a boolean is not rejected, the boolean is silently ignored and the defaults apply, so check every call above.

`findOne` returns `undefined` instead of `null` when nothing matches.

`parseJson` and `objectDeserialize` keep a serialized function as plain data, use `parseJson(json, { functions: true })` to revive it, only on a json you trust.

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
- `parseJson` returns a `Result` : check `result.ok`, then read `result.value` or `result.error`, where `v10` returned `{ error, value }` with an empty `error` on success
- `isRecord` only accepts plain objects, like `{}` or `Object.create(null)`, where `v10` also accepted functions, `Map`, `Set`, `Date` and class instances, so deep merges no longer walk into them
- `isBrowserEnvironment` returns `false` in headless browsers and when `navigator` is missing, where `v10` returned `true` and threw

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
