import { describe, it, expect } from 'vitest';
import { flushDnsCache } from './dns-cache.js';

describe('dns-cache maintenance', () => {
  describe('flushDnsCache', () => {
    it('should return result with correct structure', async () => {
      const result = await flushDnsCache();

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.message).toBe('string');
    });
  });
});

