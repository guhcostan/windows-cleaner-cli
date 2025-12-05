import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('interactive command', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('interactiveCommand module', () => {
    it('should export interactiveCommand function', async () => {
      const { interactiveCommand } = await import('./interactive.js');
      expect(typeof interactiveCommand).toBe('function');
    });
  });
});

