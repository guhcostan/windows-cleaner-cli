import { describe, it, expect } from 'vitest';
import { flushDnsCache, runDiskCleanup, clearThumbnailCache, clearFontCache } from './index.js';

describe('maintenance', () => {
  describe('flushDnsCache', () => {
    it('should return MaintenanceResult', async () => {
      const result = await flushDnsCache();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
    });
  });

  describe('runDiskCleanup', () => {
    it('should return MaintenanceResult', async () => {
      const result = await runDiskCleanup();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
    });
  });

  describe('clearThumbnailCache', () => {
    it('should return MaintenanceResult', async () => {
      const result = await clearThumbnailCache();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
    });
  });

  describe('clearFontCache', () => {
    it('should return MaintenanceResult', async () => {
      const result = await clearFontCache();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
    });
  });
});

