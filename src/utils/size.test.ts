import { describe, it, expect } from 'vitest';
import { formatSize, parseSize, SIZE_THRESHOLDS } from './size.js';

describe('size utils', () => {
  describe('formatSize', () => {
    it('should format bytes', () => {
      expect(formatSize(0)).toBe('0 B');
      expect(formatSize(500)).toBe('500 B');
    });

    it('should format kilobytes', () => {
      expect(formatSize(1024)).toBe('1.0 KB');
      expect(formatSize(2048)).toBe('2.0 KB');
    });

    it('should format megabytes', () => {
      expect(formatSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatSize(5 * 1024 * 1024)).toBe('5.0 MB');
    });

    it('should format gigabytes', () => {
      expect(formatSize(1024 * 1024 * 1024)).toBe('1.0 GB');
    });
  });

  describe('parseSize', () => {
    it('should parse bytes', () => {
      expect(parseSize('100 B')).toBe(100);
    });

    it('should parse kilobytes', () => {
      expect(parseSize('1 KB')).toBe(1024);
    });

    it('should parse megabytes', () => {
      expect(parseSize('1 MB')).toBe(1024 * 1024);
    });

    it('should parse gigabytes', () => {
      expect(parseSize('1 GB')).toBe(1024 * 1024 * 1024);
    });

    it('should return 0 for invalid input', () => {
      expect(parseSize('invalid')).toBe(0);
    });
  });

  describe('SIZE_THRESHOLDS', () => {
    it('should have correct values', () => {
      expect(SIZE_THRESHOLDS.LARGE_FILE).toBe(500 * 1024 * 1024);
      expect(SIZE_THRESHOLDS.MEDIUM_FILE).toBe(100 * 1024 * 1024);
      expect(SIZE_THRESHOLDS.SMALL_FILE).toBe(10 * 1024 * 1024);
    });
  });
});

