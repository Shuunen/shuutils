import { coverageConfigDefaults, defineConfig } from 'vitest/config'

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, 'src/index.ts', 'dist/**', '**/*.config.ts', '**/*.d.ts', 'src/bin/repo-lint.rules.ts'],
      include: ['src/**/*.ts'],
      provider: 'v8' as const,
      reporter: [['text', { maxCols: 120 }], 'lcov'],
      reportsDirectory: './coverage',
    },
    environment: 'node',
    globalSetup: './vitest.setup.ts',
    globals: true,
    include: ['src/**/*.test.ts'],
    reporters: ['dot'],
    silent: true,
  },
})
