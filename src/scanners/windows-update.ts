import { BaseScanner } from './base-scanner.js';
import { CATEGORIES, type ScanResult, type ScannerOptions, type CleanableItem } from '../types.js';
import { PATHS, exists, getSize } from '../utils/index.js';
import { stat } from 'fs/promises';

export class WindowsUpdateScanner extends BaseScanner {
  category = CATEGORIES['windows-update'];

  async scan(_options?: ScannerOptions): Promise<ScanResult> {
    const items: CleanableItem[] = [];

    if (await exists(PATHS.windowsUpdate)) {
      try {
        const size = await getSize(PATHS.windowsUpdate);
        if (size > 0) {
          const stats = await stat(PATHS.windowsUpdate);
          items.push({
            path: PATHS.windowsUpdate,
            size,
            name: 'Windows Update Download Cache',
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

