import { BaseScanner } from './base-scanner.js';
import { CATEGORIES, type ScanResult, type ScannerOptions } from '../types.js';
import { PATHS, exists, getDirectoryItems } from '../utils/index.js';

export class ItunesBackupsScanner extends BaseScanner {
  category = CATEGORIES['itunes-backups'];

  async scan(_options?: ScannerOptions): Promise<ScanResult> {
    const items = [];

    if (await exists(PATHS.itunesBackups)) {
      const backupItems = await getDirectoryItems(PATHS.itunesBackups);
      for (const item of backupItems) {
        items.push({
          ...item,
          name: `iTunes Backup: ${item.name.substring(0, 8)}...`,
        });
      }
    }

    if (await exists(PATHS.appleBackupsAlt)) {
      const backupItems = await getDirectoryItems(PATHS.appleBackupsAlt);
      for (const item of backupItems) {
        items.push({
          ...item,
          name: `Apple Backup: ${item.name.substring(0, 8)}...`,
        });
      }
    }

    return this.createResult(items);
  }
}

