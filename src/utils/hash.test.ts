import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { getFileHash, getFileHashPartial } from './hash.js';

describe('hash utils', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), 'windows-cleaner-hash-test-'));
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('getFileHash', () => {
    it('should return md5 hash of file', async () => {
      const filePath = join(testDir, 'test.txt');
      await writeFile(filePath, 'hello world');

      const hash = await getFileHash(filePath);

      expect(hash).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3');
    });

    it('should return same hash for identical files', async () => {
      const file1 = join(testDir, 'file1.txt');
      const file2 = join(testDir, 'file2.txt');
      await writeFile(file1, 'same content');
      await writeFile(file2, 'same content');

      const hash1 = await getFileHash(file1);
      const hash2 = await getFileHash(file2);

      expect(hash1).toBe(hash2);
    });

    it('should return different hash for different files', async () => {
      const file1 = join(testDir, 'file1.txt');
      const file2 = join(testDir, 'file2.txt');
      await writeFile(file1, 'content1');
      await writeFile(file2, 'content2');

      const hash1 = await getFileHash(file1);
      const hash2 = await getFileHash(file2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('getFileHashPartial', () => {
    it('should return hash of first N bytes', async () => {
      const filePath = join(testDir, 'test.txt');
      await writeFile(filePath, 'hello world this is a longer string');

      const partialHash = await getFileHashPartial(filePath, 11);
      const fullHash = await getFileHash(filePath);

      expect(partialHash).not.toBe(fullHash);
    });

    it('should return same hash as full for small files', async () => {
      const filePath = join(testDir, 'small.txt');
      await writeFile(filePath, 'small');

      const partialHash = await getFileHashPartial(filePath, 1000);
      const fullHash = await getFileHash(filePath);

      expect(partialHash).toBe(fullHash);
    });
  });
});

