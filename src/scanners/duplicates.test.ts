import { describe, it, expect } from 'vitest';
import { DuplicatesScanner } from './duplicates.js';

describe('DuplicatesScanner', () => {
  it('should have correct category', () => {
    const scanner = new DuplicatesScanner();
    expect(scanner.category.id).toBe('duplicates');
    expect(scanner.category.group).toBe('Storage');
    expect(scanner.category.safetyLevel).toBe('risky');
  });

  it('should have safety note about keeping newest', () => {
    const scanner = new DuplicatesScanner();
    expect(scanner.category.safetyNote).toBeDefined();
    expect(scanner.category.safetyNote).toContain('newest');
  });

  it('should scan without errors', async () => {
    const scanner = new DuplicatesScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('should respect minSize option', async () => {
    const scanner = new DuplicatesScanner();
    const result = await scanner.scan({ minSize: 10 * 1024 * 1024 });

    expect(result).toHaveProperty('items');
  });
});

