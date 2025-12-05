import { describe, it, expect } from 'vitest';
import { BrowserCacheScanner } from './browser-cache.js';

describe('BrowserCacheScanner', () => {
  it('should have correct category', () => {
    const scanner = new BrowserCacheScanner();
    expect(scanner.category.id).toBe('browser-cache');
    expect(scanner.category.group).toBe('Browsers');
    expect(scanner.category.safetyLevel).toBe('safe');
  });

  it('should scan without errors', async () => {
    const scanner = new BrowserCacheScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });
});

