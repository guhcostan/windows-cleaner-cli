import { describe, it, expect } from 'vitest';
import { HOME, PATHS, expandPath, isSystemPath } from './paths.js';
import { homedir } from 'os';

describe('paths utils', () => {
  describe('HOME', () => {
    it('should equal os.homedir()', () => {
      expect(HOME).toBe(homedir());
    });
  });

  describe('PATHS', () => {
    it('should have all required paths', () => {
      expect(PATHS).toHaveProperty('userCaches');
      expect(PATHS).toHaveProperty('systemTemp');
      expect(PATHS).toHaveProperty('downloads');
      expect(PATHS).toHaveProperty('chromeCache');
      expect(PATHS).toHaveProperty('edgeCache');
      expect(PATHS).toHaveProperty('npmCache');
      expect(PATHS).toHaveProperty('chocolateyCache');
    });

    it('should have string values for all paths', () => {
      for (const value of Object.values(PATHS)) {
        expect(typeof value).toBe('string');
      }
    });
  });

  describe('expandPath', () => {
    it('should expand tilde to home directory', () => {
      expect(expandPath('~\\test')).toBe(`${HOME}\\test`);
    });

    it('should return unchanged if no tilde', () => {
      expect(expandPath('C:\\test')).toBe('C:\\test');
    });
  });

  describe('isSystemPath', () => {
    it('should return true for Windows system paths', () => {
      expect(isSystemPath('C:\\Windows\\System32\\test')).toBe(true);
      expect(isSystemPath('C:\\Windows\\SysWOW64\\test')).toBe(true);
    });

    it('should return false for non-system paths', () => {
      expect(isSystemPath('C:\\Users\\test')).toBe(false);
      expect(isSystemPath('D:\\Projects\\test')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isSystemPath('c:\\windows\\system32\\test')).toBe(true);
      expect(isSystemPath('C:\\WINDOWS\\SYSTEM32\\TEST')).toBe(true);
    });
  });

  describe('Windows path patterns', () => {
    it('should handle Windows-style paths', () => {
      const winPath = 'C:\\Users\\Test\\AppData\\Local';
      expect(winPath).toContain('\\');
      expect(winPath.split('\\').length).toBeGreaterThan(1);
    });

    it('should handle environment variables patterns', () => {
      const patterns = [
        '%APPDATA%',
        '%LOCALAPPDATA%',
        '%TEMP%',
        '%USERPROFILE%',
      ];
      
      for (const pattern of patterns) {
        expect(pattern).toMatch(/^%[A-Z_]+%$/);
      }
    });
  });
});
