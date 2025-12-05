import { describe, it, expect } from 'vitest';
import { ItunesBackupsScanner } from './itunes-backups.js';

describe('ItunesBackupsScanner', () => {
  it('should have correct category', () => {
    const scanner = new ItunesBackupsScanner();
    expect(scanner.category.id).toBe('itunes-backups');
    expect(scanner.category.group).toBe('Storage');
    expect(scanner.category.safetyLevel).toBe('risky');
  });

  it('should have safety note', () => {
    const scanner = new ItunesBackupsScanner();
    expect(scanner.category.safetyNote).toBeDefined();
    expect(scanner.category.safetyNote).toContain('backup');
  });

  it('should scan without errors', async () => {
    const scanner = new ItunesBackupsScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });
});

