import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { listCategories } from './scan.js';

describe('scan command', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('listCategories', () => {
    it('should list all categories', () => {
      listCategories();

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls.flat().join('\n');
      expect(output).toContain('System Junk');
      expect(output).toContain('Development');
      expect(output).toContain('Storage');
      expect(output).toContain('Browsers');
    });
  });
});

