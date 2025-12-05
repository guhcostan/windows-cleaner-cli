import { BaseScanner } from './base-scanner.js';
import { CATEGORIES, type ScanResult, type ScannerOptions } from '../types.js';
import { PATHS, exists, getDirectoryItems } from '../utils/index.js';

export class TempFilesScanner extends BaseScanner {
  category = CATEGORIES['temp-files'];

  async scan(_options?: ScannerOptions): Promise<ScanResult> {
    const items = [];

    if (await exists(PATHS.userTemp)) {
      try {
        const userTempItems = await getDirectoryItems(PATHS.userTemp);
        items.push(...userTempItems);
      } catch {
        // May not have permission
      }
    }

    if (await exists(PATHS.systemTemp)) {
      try {
        const systemTempItems = await getDirectoryItems(PATHS.systemTemp);
        items.push(...systemTempItems);
      } catch {
        // May not have permission
      }
    }

    return this.createResult(items);
  }
}

