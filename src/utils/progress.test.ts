import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProgressBar, createScanProgress, createCleanProgress } from './progress.js';

describe('progress utils', () => {
  let originalStdoutWrite: typeof process.stdout.write;

  beforeEach(() => {
    originalStdoutWrite = process.stdout.write;
    process.stdout.write = vi.fn().mockReturnValue(true);
  });

  afterEach(() => {
    process.stdout.write = originalStdoutWrite;
  });

  describe('ProgressBar', () => {
    it('should create progress bar with options', () => {
      const bar = new ProgressBar({
        total: 10,
        label: 'Test',
      });

      expect(bar).toBeDefined();
    });

    it('should update progress', () => {
      const bar = new ProgressBar({
        total: 10,
      });

      bar.update(5);
      expect(process.stdout.write).toHaveBeenCalled();
    });

    it('should increment progress', () => {
      const bar = new ProgressBar({
        total: 10,
      });

      bar.increment();
      bar.increment();
      expect(process.stdout.write).toHaveBeenCalled();
    });

    it('should finish and clear line', () => {
      const bar = new ProgressBar({
        total: 10,
      });

      bar.update(5);
      bar.finish();
      expect(process.stdout.write).toHaveBeenCalled();
    });
  });

  describe('createScanProgress', () => {
    it('should create progress bar for scanning', () => {
      const bar = createScanProgress(10);
      expect(bar).toBeInstanceOf(ProgressBar);
    });
  });

  describe('createCleanProgress', () => {
    it('should create progress bar for cleaning', () => {
      const bar = createCleanProgress(10);
      expect(bar).toBeInstanceOf(ProgressBar);
    });
  });
});

