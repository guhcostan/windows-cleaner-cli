import { describe, it, expect } from 'vitest';
import { ALL_SCANNERS, getScanner, getAllScanners } from './index.js';

describe('scanners index', () => {
  describe('ALL_SCANNERS', () => {
    it('should have all expected scanners', () => {
      const expectedIds = [
        'system-cache',
        'system-logs',
        'temp-files',
        'recycle-bin',
        'downloads',
        'browser-cache',
        'dev-cache',
        'chocolatey',
        'docker',
        'itunes-backups',
        'windows-update',
        'prefetch',
        'large-files',
        'node-modules',
        'duplicates',
      ];

      expect(Object.keys(ALL_SCANNERS).sort()).toEqual(expectedIds.sort());
    });

    it('should have valid scanner instances', () => {
      for (const scanner of Object.values(ALL_SCANNERS)) {
        expect(scanner).toHaveProperty('category');
        expect(scanner).toHaveProperty('scan');
        expect(scanner).toHaveProperty('clean');
      }
    });
  });

  describe('getScanner', () => {
    it('should return correct scanner for category', () => {
      const scanner = getScanner('browser-cache');
      expect(scanner.category.id).toBe('browser-cache');
    });
  });

  describe('getAllScanners', () => {
    it('should return all scanners as array', () => {
      const scanners = getAllScanners();
      expect(scanners).toHaveLength(Object.keys(ALL_SCANNERS).length);
    });
  });
});

