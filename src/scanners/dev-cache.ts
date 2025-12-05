import { BaseScanner } from './base-scanner.js';
import { CATEGORIES, type ScanResult, type ScannerOptions, type CleanableItem } from '../types.js';
import { PATHS, exists, getSize } from '../utils/index.js';
import { stat } from 'fs/promises';

export class DevCacheScanner extends BaseScanner {
  category = CATEGORIES['dev-cache'];

  async scan(_options?: ScannerOptions): Promise<ScanResult> {
    const items: CleanableItem[] = [];

    const devPaths = [
      { name: 'npm cache', path: PATHS.npmCache },
      { name: 'Yarn cache', path: PATHS.yarnCache },
      { name: 'pnpm store', path: PATHS.pnpmCache },
      { name: 'pip cache', path: PATHS.pipCache },
      { name: 'NuGet packages', path: PATHS.nugetCache },
      { name: 'Gradle cache', path: PATHS.gradleCache },
      { name: 'Cargo cache', path: PATHS.cargoCache },
    ];

    for (const dev of devPaths) {
      if (await exists(dev.path)) {
        try {
          const size = await getSize(dev.path);
          if (size > 0) {
            const stats = await stat(dev.path);
            items.push({
              path: dev.path,
              size,
              name: dev.name,
              isDirectory: true,
              modifiedAt: stats.mtime,
            });
          }
        } catch {
          continue;
        }
      }
    }

    return this.createResult(items);
  }
}

