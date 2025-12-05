import { describe, it, expect } from 'vitest';
import { NodeModulesScanner } from './node-modules.js';

describe('NodeModulesScanner', () => {
  it('should have correct category', () => {
    const scanner = new NodeModulesScanner();
    expect(scanner.category.id).toBe('node-modules');
    expect(scanner.category.group).toBe('Development');
    expect(scanner.category.safetyLevel).toBe('moderate');
  });

  it('should have safety note', () => {
    const scanner = new NodeModulesScanner();
    expect(scanner.category.safetyNote).toBeDefined();
    expect(scanner.category.safetyNote).toContain('npm install');
  });

  it('should scan without errors', async () => {
    const scanner = new NodeModulesScanner();
    const result = await scanner.scan();

    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('totalSize');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('should respect daysOld option', async () => {
    const scanner = new NodeModulesScanner();
    const result = await scanner.scan({ daysOld: 365 });

    expect(result).toHaveProperty('items');
  });
});

