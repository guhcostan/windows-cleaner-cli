import type { Scanner, CategoryId, ScanResult, ScannerOptions, ScanSummary } from '../types.js';
import { SystemCacheScanner } from './system-cache.js';
import { SystemLogsScanner } from './system-logs.js';
import { TempFilesScanner } from './temp-files.js';
import { RecycleBinScanner } from './recycle-bin.js';
import { DownloadsScanner } from './downloads.js';
import { BrowserCacheScanner } from './browser-cache.js';
import { DevCacheScanner } from './dev-cache.js';
import { ChocolateyScanner } from './chocolatey.js';
import { DockerScanner } from './docker.js';
import { ItunesBackupsScanner } from './itunes-backups.js';
import { WindowsUpdateScanner } from './windows-update.js';
import { PrefetchScanner } from './prefetch.js';
import { LargeFilesScanner } from './large-files.js';
import { NodeModulesScanner } from './node-modules.js';
import { DuplicatesScanner } from './duplicates.js';

export const ALL_SCANNERS: Record<CategoryId, Scanner> = {
  'system-cache': new SystemCacheScanner(),
  'system-logs': new SystemLogsScanner(),
  'temp-files': new TempFilesScanner(),
  'recycle-bin': new RecycleBinScanner(),
  'downloads': new DownloadsScanner(),
  'browser-cache': new BrowserCacheScanner(),
  'dev-cache': new DevCacheScanner(),
  'chocolatey': new ChocolateyScanner(),
  'docker': new DockerScanner(),
  'itunes-backups': new ItunesBackupsScanner(),
  'windows-update': new WindowsUpdateScanner(),
  'prefetch': new PrefetchScanner(),
  'large-files': new LargeFilesScanner(),
  'node-modules': new NodeModulesScanner(),
  'duplicates': new DuplicatesScanner(),
};

export function getScanner(categoryId: CategoryId): Scanner {
  return ALL_SCANNERS[categoryId];
}

export function getAllScanners(): Scanner[] {
  return Object.values(ALL_SCANNERS);
}

export interface ParallelScanOptions extends ScannerOptions {
  parallel?: boolean;
  concurrency?: number;
  onProgress?: (completed: number, total: number, scanner: Scanner, result: ScanResult) => void;
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Set<Promise<void>> = new Set();

  for (const task of tasks) {
    const p: Promise<void> = task().then((result) => {
      results.push(result);
      executing.delete(p);
    });
    executing.add(p);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

export async function runAllScans(
  options?: ParallelScanOptions,
  onProgress?: (scanner: Scanner, result: ScanResult) => void
): Promise<ScanSummary> {
  const scanners = getAllScanners();
  const parallel = options?.parallel ?? true;
  const concurrency = options?.concurrency ?? 4;

  let completed = 0;
  const total = scanners.length;

  if (parallel) {
    const tasks = scanners.map((scanner) => async () => {
      const result = await scanner.scan(options);
      completed++;
      options?.onProgress?.(completed, total, scanner, result);
      onProgress?.(scanner, result);
      return { scanner, result };
    });

    const scanResults = await runWithConcurrency(tasks, concurrency);
    const results = scanResults.map((r) => r.result);

    const totalSize = results.reduce((sum, r) => sum + r.totalSize, 0);
    const totalItems = results.reduce((sum, r) => sum + r.items.length, 0);

    return { results, totalSize, totalItems };
  } else {
    const results: ScanResult[] = [];

    for (const scanner of scanners) {
      const result = await scanner.scan(options);
      results.push(result);
      completed++;
      options?.onProgress?.(completed, total, scanner, result);
      onProgress?.(scanner, result);
    }

    const totalSize = results.reduce((sum, r) => sum + r.totalSize, 0);
    const totalItems = results.reduce((sum, r) => sum + r.items.length, 0);

    return { results, totalSize, totalItems };
  }
}

export async function runScans(
  categoryIds: CategoryId[],
  options?: ParallelScanOptions,
  onProgress?: (scanner: Scanner, result: ScanResult) => void
): Promise<ScanSummary> {
  const scanners = categoryIds.map((id) => getScanner(id));
  const parallel = options?.parallel ?? true;
  const concurrency = options?.concurrency ?? 4;

  let completed = 0;
  const total = scanners.length;

  if (parallel) {
    const tasks = scanners.map((scanner) => async () => {
      const result = await scanner.scan(options);
      completed++;
      options?.onProgress?.(completed, total, scanner, result);
      onProgress?.(scanner, result);
      return { scanner, result };
    });

    const scanResults = await runWithConcurrency(tasks, concurrency);
    const results = scanResults.map((r) => r.result);

    const totalSize = results.reduce((sum, r) => sum + r.totalSize, 0);
    const totalItems = results.reduce((sum, r) => sum + r.items.length, 0);

    return { results, totalSize, totalItems };
  } else {
    const results: ScanResult[] = [];

    for (const scanner of scanners) {
      const result = await scanner.scan(options);
      results.push(result);
      completed++;
      options?.onProgress?.(completed, total, scanner, result);
      onProgress?.(scanner, result);
    }

    const totalSize = results.reduce((sum, r) => sum + r.totalSize, 0);
    const totalItems = results.reduce((sum, r) => sum + r.items.length, 0);

    return { results, totalSize, totalItems };
  }
}

export {
  SystemCacheScanner,
  SystemLogsScanner,
  TempFilesScanner,
  RecycleBinScanner,
  DownloadsScanner,
  BrowserCacheScanner,
  DevCacheScanner,
  ChocolateyScanner,
  DockerScanner,
  ItunesBackupsScanner,
  WindowsUpdateScanner,
  PrefetchScanner,
  LargeFilesScanner,
  NodeModulesScanner,
  DuplicatesScanner,
};

