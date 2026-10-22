# Changelog

All notable changes to this project are documented here.
Versions before `11.0.0` are listed in the [git tags](https://github.com/Shuunen/shuutils/tags).

## 12.0.0

`11.1.0` was tagged but never published to npm, upgrading from `11.0.0` to `12.0.0` also brings the [11.1.0 changes](#1110).

### Breaking in 12.0.0

- The package is esm only, `dist/shuutils.cjs` and `dist/shuutils.d.cts` are gone, `require('shuutils')` keeps working on Node `>=22.12.0` through `require(esm)`
- The package now requires Node `>=22.12.0` through `engines`
- The `unique-mark` bin is now `dist/unique-mark.js`, an esm file like the other bins
- `findOne` returns `undefined` instead of `null` when nothing matches, like the rest of the library
- Boolean flags moved into an options object with plain names : `objectSerialize`, `objectEqual`, `objectSum`, `stringify`, `readableTime` (`{ short: true }` replaces `false`), `dateToIsoString`, `sanitize`, `capitalize`, `link`, `copyToClipboard` and `readClipboard`, and `createAnalytics` renames `willLog` / `willPile` to `log` / `pile`, see the README migration table. A `v11` call that still passes a boolean, like `sanitize(text, false)`, does not throw : the boolean is silently ignored and the defaults apply, TypeScript flags these calls
- `parseJson` and `objectDeserialize` no longer revive the functions serialized by `objectSerialize`, which ran their source code and let a crafted json, like the one `decodeFromUrl` reads from a url or `storage.get` reads from a storage, run any code. Pass `{ functions: true }` on a trusted string to revive them
- `Logger` with a `storage` keeps only the last 1000 lines
- `clone` of an object holding a function no longer goes through `objectSerialize`, which ran the source of any value shaped like a serialized function. The copy now holds the very same functions, keeps method shorthands, circular and shared references, `undefined`, `NaN`, `Map`, `Set`, typed arrays and the prototype of class instances holding a function, where it used to flatten them like JSON. A nested class instance without its own function still comes back as a plain object, like in `v11`
- `waitToDetect(selector, { wait, maxTries })` takes an options object instead of `(selector, wait, nbTries, maxTry)`, tries exactly `maxTries` times instead of `maxTry + 2`, checks right away and waits only between tries instead of before each one, reports the real number of tries in its error, and infers the element type from the selector like `findOne`
- `capNesting` is typed to return a record, and a `maxLevel` below `1` keeps the top level object instead of returning `'...'`
- `injectMark` and `countPlaceholders` match the mustache form only with two braces, `{{ name }}` as documented, a single brace like `{ name }` also matched and rewrote js destructuring and object shorthands when the placeholder looked like an identifier
- `unique-mark` throws when it injects no mark at all, for one file or a whole folder, so a ci build can not ship unmarked

### Added in 12.0.0

- `shuutils/plugins` entry with `uniqueMark()`, a vite / rolldown / rollup / tsdown plugin that injects the unique mark in the built js, css and html files, and adds a `/* unique-mark : ... */` banner to js and css files unless `banner: false`, shifting their source maps to match and warning about a source map it can not shift, like an index map with sections. A byte order mark stays first. The version comes from the vite root package.json, else the working directory one, and the commit from the vite root
- `unique-mark` accepts a folder target to mark every js, css and html file inside it, other files like images and fonts are left untouched
- `countPlaceholders` counts the placeholder-shaped usages of a string, the `uniqueMark` plugin uses it to warn about each placeholder left without a mark
- `shuutils/package.json` is exported, so tools can read the package metadata
- `findOne` and `findAll` infer the element type from the selector tag, `findOne('form > input')` is an `HTMLInputElement`, `findOne<HTMLInputElement>('.email')` names it for selectors without a tag, a selector list or a functional pseudo-class like `:has()` stays an `HTMLElement` since it can match another element than its last tag, and the new `SelectedElement<'...'>` type exposes the inference
- `readClipboard` takes the clipboard to read from again, like in `v10`, through the `clipboard` option, default `navigator.clipboard`
- `on` takes a data type again, `on<{ id: number }>('select', user => user.id)`, defaulting to `unknown`

### Fixed in 12.0.0

- `injectMark` corrupted marks containing a `$`, like `$1` or `$&`, which were read as replacement patterns
- `injectMark` read the placeholder as a regex, `app.mark` also matched `appXmark` and `mark(1)` threw, it is now matched as is
- `debounce` left every pending call waiting forever when the debounced function threw, they now reject with its error
- `Logger` with a `storage` stopped saving for good after one failed save, and when its key holds something else than logs it now leaves that data untouched instead of failing
- `Logger` with a `storage` read and rewrote the whole stored log on every line, a burst of lines is now saved with a single read and write
- `handlePlural` and `$t` used `parseInt` on the count, so `1.5` picked the singular form, a number count is now used as is and other values go through `Number`
- `unique-mark` no longer throws outside a git repository, the mark uses `no-git-commit` instead of the commit hash
- `unique-mark` no longer throws on a package.json without version, it warns and marks without a version like the plugin, and it no longer rewrites nor lists a file it did not change
- `injectMark` took about a minute on a big minified chunk, it now finds the elements with `indexOf` and skips a content without the placeholder right away
- `injectMark` took a selector like `[id="unique-mark"]` after a `<` comparison in minified js for an element and deleted the code up to the next closing tag, an attribute now needs a whitespace before it
- `unique-mark` skips a file that is not utf8 text, a glob matching an image or a font no longer corrupts it
- `injectMark` missed a jsx placeholder minified by rolldown, like ``(0,e.jsx)(`span`,{id:`unique-mark`})``, and `countPlaceholders` did not count it, so the `uniqueMark` plugin shipped it unmarked without a warning on tsdown and vite 8
- `injectMark` put the jsx children before the first `}` after the id, a template literal like ``className:`v ${c}` `` became a syntax error and a nested object got the mark, the children now go right after the id
- `injectMark` ended a tag at the first `>`, an attribute value like `x-show="count > 0"` was cut and the html corrupted, a quoted `>` after the id is now skipped
- `uniqueMark` and `unique-mark` refuse an empty placeholder, which marked `id=""` and `____` anywhere
- `Logger` with a `storage` replaced the whole stored history with the new lines after a failed read, it now skips that save
- `Logger` with a `storage` kept only the string lines of an array under its key and overwrote the rest, an array holding anything else than strings is now left untouched like any other foreign data
- `capNesting` made an own `__proto__` key, like one from `JSON.parse`, the prototype of its result, it is now a plain key
- `uniqueMark` warns when the git commit can not be read and the mark falls back to `no-git-commit`, and keeps a CRLF shebang first
- `unique-mark` reports a documented placeholder it could not replace next to a replaced one, like the `uniqueMark` plugin

### Changed in 12.0.0

- `debounce` names its first parameter `method`, it resolves through `Promise.withResolvers`, available from Node 22 and Safari 17.4
- The bundles are marked by the `uniqueMark` plugin during the build, the banner is now `/* unique-mark : version - commit - date */`

## 11.1.0

### Fixed in 11.1.0

- `isDevEnvironment` and `isDeployedInDevNamespace` threw a `TypeError` when called without arguments from the cjs bundle, where `import.meta.env` does not exist

### Changed in 11.1.0

- Zero runtime dependencies, the clis use the native `fs.glob` instead of `tiny-glob`
- `unique-mark` accepts plain globs like `*.js`, the `*.{js}` form still works
- The package now requires Node `>=22.2.0` through `engines`, needed by the clis
- The package declares `"sideEffects": false` so bundlers can drop unused modules
- The build moved from tsup to tsdown and TypeScript 7, the bundles keep their JSDoc comments and the typings list the same exports

## 11.0.0

### Breaking in 11.0.0

- Removed the top-level `ok`, `err`, `unwrap` and `trySafe` exports, use `Result.ok`, `Result.err`, `Result.unwrap` and `Result.trySafe`
- Removed `expectType` and `expectEqualTypes`, use your test runner's own type assertions
- Removed `cn`, `genClass`, `access` and `jsonStartRegex`
- `sanitize` and `slugify` now treat `.` as a separator, so `slugify('example.com')` returns `example-com` where `v10` returned `examplecom`

### Fixed in 11.0.0

- `crc32` returned a negative number for about half of its inputs, which also affected `stringSum` and `objectSum`, the results are back to the `v10` values
- The published `unique-mark` bin did nothing, the cjs bundle never reached its entry point
- `alignForSnap` threw a `ReferenceError` when used outside a DOM environment
- The package shipped without a `types` field nor exports conditions, so `node16` and `nodenext` consumers got no typings
- `dist` is now built on `prepack`, so publishing cannot ship a stale bundle

### Changed in 11.0.0

- The whole library is split into one module per file under `src/lib`, with a generated barrel
- The toolchain moved to pnpm, turbo, vitest, oxlint, oxfmt, tsup and tsgo
- `header-injector` takes a `--target` glob and defaults to `src/**/*.ts` instead of walking the whole working directory
