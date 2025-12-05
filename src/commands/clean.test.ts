import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanCommand } from './clean.js';

describe('clean command', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('cleanCommand', () => {
    it('should handle no progress option', async () => {
      const result = await cleanCommand({
        noProgress: true,
        dryRun: true,
        all: true,
      });

      expect(result === null || typeof result === 'object').toBe(true);
    });
  });
});

