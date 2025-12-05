import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.test.ts',
        '**/index.ts',
        'src/scanners/duplicates.ts',
        'src/scanners/node-modules.ts',
        'src/scanners/recycle-bin.ts',
        'src/scanners/chocolatey.ts',
        'src/scanners/itunes-backups.ts',
        'src/scanners/windows-update.ts',
        'src/scanners/prefetch.ts',
        'src/utils/backup.ts',
        'src/commands/interactive.ts',
        'src/commands/uninstall.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 70,
        branches: 50,
        statements: 60,
      },
    },
  },
});

