import { describe, it, expect } from 'vitest';
import { flushDnsCache, clearThumbnailCache } from './index.js';

describe('maintenance', () => {
  describe('flushDnsCache', () => {
    it('should return MaintenanceResult', async () => {
      const result = await flushDnsCache();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
    }, 10000);
  });

  describe('clearThumbnailCache', () => {
    it('should return MaintenanceResult', async () => {
      const result = await clearThumbnailCache();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
    }, 10000);
  });

  describe('runDiskCleanup', () => {
    it('should export function', async () => {
      const { runDiskCleanup } = await import('./index.js');
      expect(typeof runDiskCleanup).toBe('function');
    });
  });

  describe('clearFontCache', () => {
    it('should export function', async () => {
      const { clearFontCache } = await import('./index.js');
      expect(typeof clearFontCache).toBe('function');
    });
  });
});
