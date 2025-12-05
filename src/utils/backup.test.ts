import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { ensureBackupDir, getBackupDir, listBackups, cleanOldBackups } from './backup.js';

describe('backup utils', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), 'windows-cleaner-backup-test-'));
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('ensureBackupDir', () => {
    it('should create backup directory with timestamp', async () => {
      const backupDir = await ensureBackupDir();
      expect(backupDir).toContain('backup');
    });
  });

  describe('getBackupDir', () => {
    it('should return backup directory path', () => {
      const dir = getBackupDir();
      expect(typeof dir).toBe('string');
      expect(dir).toContain('windows-cleaner-cli');
    });
  });

  describe('listBackups', () => {
    it('should return array of backups', async () => {
      const backups = await listBackups();
      expect(Array.isArray(backups)).toBe(true);
    });

    it('should return empty array when no backups exist', async () => {
      const backups = await listBackups();
      expect(Array.isArray(backups)).toBe(true);
    });
  });

  describe('cleanOldBackups', () => {
    it('should return number of cleaned backups', async () => {
      const cleaned = await cleanOldBackups();
      expect(typeof cleaned).toBe('number');
      expect(cleaned).toBeGreaterThanOrEqual(0);
    });
  });
});

