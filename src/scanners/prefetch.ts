import { BaseScanner } from './base-scanner.js';
import { CATEGORIES, type ScanResult, type ScannerOptions, type CleanableItem } from '../types.js';
import { PATHS, exists, getSize } from '../utils/index.js';
import { stat } from 'fs/promises';

export class PrefetchScanner extends BaseScanner {
  category = CATEGORIES['prefetch'];

  async scan(_options?: ScannerOptions): Promise<ScanResult> {
    const items: CleanableItem[] = [];

    if (await exists(PATHS.prefetch)) {
      try {
        const size = await getSize(PATHS.prefetch);
        if (size > 0) {
          const stats = await stat(PATHS.prefetch);
          items.push({
            path: PATHS.prefetch,
            size,
            name: 'Windows Prefetch Data',
            isDirectory: true,
            modifiedAt: stats.mtime,
          });
        }
      } catch {
        // May not have permission
      }
    }

    return this.createResult(items);
  }
}

