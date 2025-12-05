import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { loadConfig, getDefaultConfig, clearConfigCache } from './config.js';

describe('config utils', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), 'windows-cleaner-config-test-'));
    clearConfigCache();
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
    clearConfigCache();
  });

  describe('loadConfig', () => {
    it('should load config from file', async () => {
      const configPath = join(testDir, 'config.json');
      await writeFile(configPath, JSON.stringify({ downloadsDaysOld: 60 }));

      const config = await loadConfig(configPath);

      expect(config.downloadsDaysOld).toBe(60);
    });

    it('should return default config if file not found', async () => {
      const config = await loadConfig(join(testDir, 'nonexistent.json'));

      expect(config).toEqual(getDefaultConfig());
    });

    it('should merge with defaults', async () => {
      const configPath = join(testDir, 'config.json');
      await writeFile(configPath, JSON.stringify({ downloadsDaysOld: 60 }));

      const config = await loadConfig(configPath);

      expect(config.downloadsDaysOld).toBe(60);
      expect(config.parallelScans).toBe(true);
    });
  });

  describe('getDefaultConfig', () => {
    it('should return default config', () => {
      const config = getDefaultConfig();

      expect(config.downloadsDaysOld).toBe(30);
      expect(config.largeFilesMinSize).toBe(500 * 1024 * 1024);
      expect(config.backupEnabled).toBe(false);
      expect(config.parallelScans).toBe(true);
      expect(config.concurrency).toBe(4);
    });
  });
});

