import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('uninstall command', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('uninstallCommand module', () => {
    it('should export uninstallCommand function', async () => {
      const { uninstallCommand } = await import('./uninstall.js');
      expect(typeof uninstallCommand).toBe('function');
    });
  });
});

