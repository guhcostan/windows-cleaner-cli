import { BaseScanner } from './base-scanner.js';
import { CATEGORIES, type ScanResult, type ScannerOptions, type CleanableItem, type CleanResult } from '../types.js';
import { PATHS, exists, getSize } from '../utils/index.js';
import { stat, rm } from 'fs/promises';

export class ChocolateyScanner extends BaseScanner {
  category = CATEGORIES['chocolatey'];

  async scan(_options?: ScannerOptions): Promise<ScanResult> {
    const items: CleanableItem[] = [];

    if (await exists(PATHS.chocolateyCache)) {
      try {
        const size = await getSize(PATHS.chocolateyCache);
        if (size > 0) {
          const stats = await stat(PATHS.chocolateyCache);
          items.push({
            path: PATHS.chocolateyCache,
            size,
            name: 'Chocolatey Download Cache',
            isDirectory: true,
            modifiedAt: stats.mtime,
          });
        }
      } catch {
        // Chocolatey may not be installed
      }
    }

    if (await exists(PATHS.scoopCache)) {
      try {
        const size = await getSize(PATHS.scoopCache);
        if (size > 0) {
          const stats = await stat(PATHS.scoopCache);
          items.push({
            path: PATHS.scoopCache,
            size,
            name: 'Scoop Download Cache',
            isDirectory: true,
            modifiedAt: stats.mtime,
          });
        }
      } catch {
        // Scoop may not be installed
      }
    }

    return this.createResult(items);
  }

  async clean(items: CleanableItem[], dryRun = false): Promise<CleanResult> {
    if (dryRun) {
      return {
        category: this.category,
        cleanedItems: items.length,
        freedSpace: items.reduce((sum, item) => sum + item.size, 0),
        errors: [],
      };
    }

    const errors: string[] = [];
    let freedSpace = 0;
    let cleanedItems = 0;

    for (const item of items) {
      try {
        const size = item.size;
        await rm(item.path, { recursive: true, force: true });
        freedSpace += size;
        cleanedItems++;
      } catch (error) {
        errors.push(`Failed to clean ${item.name}: ${error}`);
      }
    }

    return {
      category: this.category,
      cleanedItems,
      freedSpace,
      errors,
    };
  }
}

