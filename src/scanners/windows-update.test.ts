import { describe, it, expect } from 'vitest';
import { WindowsUpdateScanner } from './windows-update.js';

describe('WindowsUpdateScanner', () => {
  it('should have correct category', () => {
    const scanner = new WindowsUpdateScanner();
    expect(scanner.category.id).toBe('windows-update');
    expect(scanner.category.group).toBe('System Junk');
    expect(scanner.category.safetyLevel).toBe('moderate');
  });

  it('should have safety note', () => {
    const scanner = new WindowsUpdateScanner();
    expect(scanner.category.safetyNote).toBeDefined();
  });

  it('should scan without errors', async () => {
    const scanner = new WindowsUpdateScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });
});

