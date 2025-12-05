import { describe, it, expect } from 'vitest';
import { ChocolateyScanner } from './chocolatey.js';

describe('ChocolateyScanner', () => {
  it('should have correct category', () => {
    const scanner = new ChocolateyScanner();
    expect(scanner.category.id).toBe('chocolatey');
    expect(scanner.category.group).toBe('Development');
    expect(scanner.category.safetyLevel).toBe('safe');
  });

  it('should scan without errors even if chocolatey is not installed', async () => {
    const scanner = new ChocolateyScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('should handle dry run for clean', async () => {
    const scanner = new ChocolateyScanner();
    const result = await scanner.clean([], true);

    expect(result.cleanedItems).toBe(0);
    expect(result.freedSpace).toBe(0);
    expect(result.errors).toHaveLength(0);
  });
});

