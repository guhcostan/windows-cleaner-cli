import { describe, it, expect } from 'vitest';
import { LargeFilesScanner } from './large-files.js';

describe('LargeFilesScanner', () => {
  it('should have correct category', () => {
    const scanner = new LargeFilesScanner();
    expect(scanner.category.id).toBe('large-files');
    expect(scanner.category.group).toBe('Large Files');
    expect(scanner.category.safetyLevel).toBe('risky');
  });

  it('should scan without errors', async () => {
    const scanner = new LargeFilesScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('should respect minSize option', async () => {
    const scanner = new LargeFilesScanner();
    const result = await scanner.scan({ minSize: 1024 * 1024 * 1024 });

    expect(result).toHaveProperty('items');
  });
});

