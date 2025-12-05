import { describe, it, expect } from 'vitest';
import { RecycleBinScanner } from './recycle-bin.js';

describe('RecycleBinScanner', () => {
  it('should have correct category', () => {
    const scanner = new RecycleBinScanner();
    expect(scanner.category.id).toBe('recycle-bin');
    expect(scanner.category.group).toBe('Storage');
    expect(scanner.category.safetyLevel).toBe('safe');
  });

  it('should scan without errors', async () => {
    const scanner = new RecycleBinScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('should handle dry run for clean', async () => {
    const scanner = new RecycleBinScanner();
    const result = await scanner.clean([], true);

    expect(result.cleanedItems).toBe(0);
    expect(result.freedSpace).toBe(0);
    expect(result.errors).toHaveLength(0);
  });
});

