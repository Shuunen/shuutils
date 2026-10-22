import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { isBrowserEnvironment, isDeployedInDevNamespace, isDevEnvironment, isTestEnvironment } from './environment.ts'
import { invariant } from './invariant.ts'

if (!GlobalRegistrator.isRegistered) GlobalRegistrator.register()

describe('environment utils', () => {
  const testSamples = [
    ['A default to globalThis should detect a test environment', undefined, true],
    ['B should detect a jest test environment', { jest: true }, true],
    ['C should detect a mocha test environment', { mocha: true }, true],
    ['D should detect a vitest test environment', { __vitest_environment__: true }, true],
    ['E should detect a bun test environment', { Bun: { argv: ['script.test.js'] } }, true],
    ['F should not detect a bun test environment', { Bun: { argv: ['script.js'] } }, false],
    ['G should not detect any test environment', {}, false],
  ] as const

  it.each(testSamples)('isTestEnvironment %s', (_title, sample, expected) => {
    expect(isTestEnvironment(sample)).toBe(expected)
  })

  const browserSamples = [
    ['A we want dev env by default to not be detected as browser', undefined, false],
    ['B by skipping the isHappyDom guard, the dev env is indeed detected as browser', 'hey', true],
    ['C headless browser should not be detected as browser', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/121.0.0.0 Safari/537.36', false],
    ['D empty userAgent should not be detected as browser', '', false],
  ] as const

  it.each(browserSamples)('isBrowserEnvironment %s', (_title, sample, expected) => {
    expect(isBrowserEnvironment(sample)).toBe(expected)
  })

  describe(isDevEnvironment, () => {
    beforeEach(() => {
      vi.resetModules()
      vi.unstubAllEnvs()
    })

    it('A should be true when import.meta.env.DEV is true', () => {
      vi.stubEnv('DEV', true)
      expect(isDevEnvironment()).toBe(true)
    })

    it('B should be false when import.meta.env.DEV is false', () => {
      vi.stubEnv('DEV', false)
      expect(isDevEnvironment()).toBe(false)
    })
  })
})

function mockLocationHost(host: string): void {
  Object.defineProperty(globalThis.window, 'location', {
    value: { host },
    writable: true,
  })
}

describe(isDeployedInDevNamespace, () => {
  const originalLocation = globalThis.window.location

  afterEach(() => {
    Object.defineProperty(globalThis.window, 'location', {
      value: originalLocation,
      writable: true,
    })
    vi.resetAllMocks()
  })

  it('returns true if isDevEnvironment returns true', () => {
    mockLocationHost('not-dev.foo.com')
    expect(isDeployedInDevNamespace(true)).toBe(true)
  })

  it('returns true if subdomain matches DEV_SUBDOMAIN', () => {
    mockLocationHost('my-app.vercel-foobar.org')
    expect(isDeployedInDevNamespace(false, 'my-app')).toBe(true)
  })

  it('returns false if neither isDevEnvironment is true nor subdomain matches DEV_SUBDOMAIN', () => {
    mockLocationHost('some-other-subdomain.example.com')
    expect(isDeployedInDevNamespace(false)).toBe(false)
  })
})

describe('environment utils in the bundle loaded through require', () => {
  // cjs consumers load the esm bundle with require(esm), where import.meta.env does not exist, so the defaults must not crash there
  const distEsm = path.join(import.meta.dirname, '../../dist/shuutils.js')

  it('isDevEnvironment should not throw without import.meta.env', () => {
    invariant(existsSync(distEsm), 'dist/shuutils.js is missing, run pnpm run build first')
    const bundle = createRequire(import.meta.url)(distEsm) as { isDeployedInDevNamespace: typeof isDeployedInDevNamespace; isDevEnvironment: typeof isDevEnvironment }
    expect(bundle.isDevEnvironment()).toBeUndefined()
  })

  it('isDeployedInDevNamespace should not throw without import.meta.env', () => {
    invariant(existsSync(distEsm), 'dist/shuutils.js is missing, run pnpm run build first')
    const bundle = createRequire(import.meta.url)(distEsm) as { isDeployedInDevNamespace: typeof isDeployedInDevNamespace; isDevEnvironment: typeof isDevEnvironment }
    mockLocationHost('my-app.example.com')
    expect(bundle.isDeployedInDevNamespace()).toBe(false)
  })
})
