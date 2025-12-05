import { describe, it, expect } from 'vitest';
import { SystemLogsScanner } from './system-logs.js';

describe('SystemLogsScanner', () => {
  it('should have correct category', () => {
    const scanner = new SystemLogsScanner();
    expect(scanner.category.id).toBe('system-logs');
    expect(scanner.category.group).toBe('System Junk');
    expect(scanner.category.safetyLevel).toBe('moderate');
  });

  it('should scan without errors', async () => {
    const scanner = new SystemLogsScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });
});

