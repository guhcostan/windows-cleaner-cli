import { BaseScanner } from './base-scanner.js';
import { CATEGORIES, type ScanResult, type ScannerOptions, type CleanableItem } from '../types.js';
import { PATHS, exists, getSize } from '../utils/index.js';
import { stat, readdir } from 'fs/promises';
import { join } from 'path';

export class BrowserCacheScanner extends BaseScanner {
  category = CATEGORIES['browser-cache'];

  async scan(_options?: ScannerOptions): Promise<ScanResult> {
    const items: CleanableItem[] = [];

    const browserPaths = [
      { name: 'Google Chrome', path: PATHS.chromeCache },
      { name: 'Google Chrome Code Cache', path: PATHS.chromeCacheData },
      { name: 'Microsoft Edge', path: PATHS.edgeCache },
      { name: 'Brave Browser', path: PATHS.braveCache },
    ];

    for (const browser of browserPaths) {
      if (await exists(browser.path)) {
        try {
          const size = await getSize(browser.path);
          const stats = await stat(browser.path);
          items.push({
            path: browser.path,
            size,
            name: `${browser.name} Cache`,
            isDirectory: true,
            modifiedAt: stats.mtime,
          });
        } catch {
          continue;
        }
      }
    }

    if (await exists(PATHS.firefoxProfiles)) {
      try {
        const profiles = await readdir(PATHS.firefoxProfiles);
        for (const profile of profiles) {
          const cachePath = join(PATHS.firefoxProfiles, profile, 'cache2');
          if (await exists(cachePath)) {
            const size = await getSize(cachePath);
            const stats = await stat(cachePath);
            items.push({
              path: cachePath,
              size,
              name: `Firefox Cache (${profile})`,
              isDirectory: true,
              modifiedAt: stats.mtime,
            });
          }
        }
      } catch {
        // Ignore
      }
    }

    return this.createResult(items);
  }
}

