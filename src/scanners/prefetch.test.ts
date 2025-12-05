import { describe, it, expect } from 'vitest';
import { PrefetchScanner } from './prefetch.js';

describe('PrefetchScanner', () => {
  it('should have correct category', () => {
    const scanner = new PrefetchScanner();
    expect(scanner.category.id).toBe('prefetch');
    expect(scanner.category.group).toBe('System Junk');
    expect(scanner.category.safetyLevel).toBe('moderate');
  });

  it('should have safety note about app launch speed', () => {
    const scanner = new PrefetchScanner();
    expect(scanner.category.safetyNote).toBeDefined();
    expect(scanner.category.safetyNote).toContain('slower');
  });

  it('should scan without errors', async () => {
    const scanner = new PrefetchScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });
});

