import { describe, it, expect } from 'vitest';
import { SystemCacheScanner } from './system-cache.js';

describe('SystemCacheScanner', () => {
  it('should have correct category', () => {
    const scanner = new SystemCacheScanner();
    expect(scanner.category.id).toBe('system-cache');
    expect(scanner.category.group).toBe('System Junk');
  });

  it('should scan without errors', async () => {
    const scanner = new SystemCacheScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });
});

