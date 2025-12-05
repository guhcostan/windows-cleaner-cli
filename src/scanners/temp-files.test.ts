import { describe, it, expect } from 'vitest';
import { TempFilesScanner } from './temp-files.js';

describe('TempFilesScanner', () => {
  it('should have correct category', () => {
    const scanner = new TempFilesScanner();
    expect(scanner.category.id).toBe('temp-files');
    expect(scanner.category.safetyLevel).toBe('safe');
  });

  it('should scan without errors', async () => {
    const scanner = new TempFilesScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
  });
});

