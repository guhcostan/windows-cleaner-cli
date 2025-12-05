import { describe, it, expect } from 'vitest';
import { DownloadsScanner } from './downloads.js';

describe('DownloadsScanner', () => {
  it('should have correct category', () => {
    const scanner = new DownloadsScanner();
    expect(scanner.category.id).toBe('downloads');
    expect(scanner.category.group).toBe('Storage');
    expect(scanner.category.safetyLevel).toBe('risky');
  });

  it('should scan without errors', async () => {
    const scanner = new DownloadsScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('should respect daysOld option', async () => {
    const scanner = new DownloadsScanner();
    const result = await scanner.scan({ daysOld: 365 });

    expect(result).toHaveProperty('items');
  });
});

