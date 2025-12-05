import { BaseScanner } from './base-scanner.js';
import { CATEGORIES, type ScanResult, type ScannerOptions, type CleanableItem, type CleanResult } from '../types.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class RecycleBinScanner extends BaseScanner {
  category = CATEGORIES['recycle-bin'];

  async scan(_options?: ScannerOptions): Promise<ScanResult> {
    const items: CleanableItem[] = [];

    try {
      const { stdout } = await execAsync(
        'powershell -Command "(New-Object -ComObject Shell.Application).NameSpace(10).Items() | ForEach-Object { $_.Size }"',
        { shell: 'cmd.exe' }
      );

      const sizes = stdout.trim().split('\n').filter(Boolean);
      let totalSize = 0;

      for (const size of sizes) {
        const sizeNum = parseInt(size.trim(), 10);
        if (!isNaN(sizeNum)) {
          totalSize += sizeNum;
        }
      }

      if (totalSize > 0) {
        items.push({
          path: '$Recycle.Bin',
          size: totalSize,
          name: 'Recycle Bin Contents',
          isDirectory: true,
        });
      }
    } catch {
      // Recycle bin may be empty or inaccessible
    }

    return this.createResult(items);
  }

  async clean(items: CleanableItem[], dryRun = false): Promise<CleanResult> {
    if (dryRun || items.length === 0) {
      return {
        category: this.category,
        cleanedItems: items.length,
        freedSpace: items.reduce((sum, item) => sum + item.size, 0),
        errors: [],
      };
    }

    const errors: string[] = [];
    let freedSpace = 0;

    try {
      const beforeSize = items.reduce((sum, item) => sum + item.size, 0);
      await execAsync(
        'powershell -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"',
        { shell: 'cmd.exe' }
      );
      freedSpace = beforeSize;
    } catch (error) {
      errors.push(`Failed to empty Recycle Bin: ${error}`);
    }

    return {
      category: this.category,
      cleanedItems: errors.length === 0 ? items.length : 0,
      freedSpace,
      errors,
    };
  }
}

