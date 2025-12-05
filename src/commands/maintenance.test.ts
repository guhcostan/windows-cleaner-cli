import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { maintenanceCommand } from './maintenance.js';

describe('maintenance command', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('maintenanceCommand', () => {
    it('should show help when no options provided', async () => {
      await maintenanceCommand({});

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls.flat().join('\n');
      expect(output).toContain('No maintenance tasks specified');
    });
  });
});

