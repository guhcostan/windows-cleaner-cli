import chalk from 'chalk';
import confirm from '@inquirer/confirm';
import checkbox from '@inquirer/checkbox';
import { readdir, stat, rm } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { exists, getSize, formatSize, createCleanProgress } from '../utils/index.js';

interface AppInfo {
  name: string;
  path: string;
  size: number;
  relatedPaths: string[];
  totalSize: number;
}

interface UninstallCommandOptions {
  yes?: boolean;
  dryRun?: boolean;
  noProgress?: boolean;
}

const LOCALAPPDATA = process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local');
const APPDATA = process.env.APPDATA || join(homedir(), 'AppData', 'Roaming');
const PROGRAMFILES = process.env.ProgramFiles || 'C:\\Program Files';
const PROGRAMFILESX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

const RELATED_PATHS_TEMPLATES = [
  join(LOCALAPPDATA, '{APP_NAME}'),
  join(APPDATA, '{APP_NAME}'),
  join(LOCALAPPDATA, 'Programs', '{APP_NAME}'),
  join(homedir(), 'AppData', 'LocalLow', '{APP_NAME}'),
];

export async function uninstallCommand(options: UninstallCommandOptions): Promise<void> {
  console.log(chalk.cyan('\nScanning installed applications...\n'));
  console.log(chalk.dim('Note: This scans user-installed apps in AppData. For full uninstall, use Windows Settings.\n'));

  const apps = await getInstalledApps();

  if (apps.length === 0) {
    console.log(chalk.yellow('No user-installed applications found in common locations.\n'));
    return;
  }

  const choices = apps.map((app) => ({
    name: `${app.name.padEnd(35)} ${chalk.yellow(formatSize(app.totalSize).padStart(10))} ${chalk.dim(`(+${app.relatedPaths.length} related)`)}`,
    value: app.name,
    checked: false,
  }));

  const selectedApps = await checkbox<string>({
    message: 'Select applications to remove:',
    choices,
    pageSize: 15,
  });

  if (selectedApps.length === 0) {
    console.log(chalk.yellow('\nNo applications selected.\n'));
    return;
  }

  const appsToRemove = apps.filter((a) => selectedApps.includes(a.name));
  const totalSize = appsToRemove.reduce((sum, a) => sum + a.totalSize, 0);
  const totalPaths = appsToRemove.reduce((sum, a) => sum + 1 + a.relatedPaths.length, 0);

  console.log();
  console.log(chalk.bold('Applications to remove:'));
  for (const app of appsToRemove) {
    console.log(`  ${chalk.red('✗')} ${app.name} (${formatSize(app.totalSize)})`);
    for (const related of app.relatedPaths) {
      console.log(chalk.dim(`      └─ ${related.replace(homedir(), '~')}`));
    }
  }
  console.log();
  console.log(chalk.bold(`Total: ${formatSize(totalSize)} will be freed (${totalPaths} items)`));
  console.log();

  if (options.dryRun) {
    console.log(chalk.cyan('[DRY RUN] Would remove the above applications.\n'));
    return;
  }

  if (!options.yes) {
    const proceed = await confirm({
      message: 'Proceed with removal?',
      default: false,
    });

    if (!proceed) {
      console.log(chalk.yellow('\nRemoval cancelled.\n'));
      return;
    }
  }

  const showProgress = !options.noProgress && process.stdout.isTTY;
  const progress = showProgress ? createCleanProgress(appsToRemove.length) : null;

  let removedCount = 0;
  let freedSpace = 0;
  const errors: string[] = [];

  for (let i = 0; i < appsToRemove.length; i++) {
    const app = appsToRemove[i];
    progress?.update(i, `Removing ${app.name}...`);

    try {
      await rm(app.path, { recursive: true, force: true });
      freedSpace += app.size;

      for (const relatedPath of app.relatedPaths) {
        try {
          await rm(relatedPath, { recursive: true, force: true });
          const size = await getSize(relatedPath).catch(() => 0);
          freedSpace += size;
        } catch {
          // Ignore errors for related paths
        }
      }

      removedCount++;
    } catch (error) {
      errors.push(`${app.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  progress?.finish();

  console.log();
  console.log(chalk.bold.green('✓ Removal Complete'));
  console.log(chalk.dim('─'.repeat(50)));
  console.log(`  Apps removed: ${removedCount}`);
  console.log(`  Space freed: ${chalk.green(formatSize(freedSpace))}`);

  if (errors.length > 0) {
    console.log();
    console.log(chalk.red('Errors:'));
    for (const error of errors) {
      console.log(chalk.red(`  ✗ ${error}`));
    }
  }

  console.log();
}

async function getInstalledApps(): Promise<AppInfo[]> {
  const apps: AppInfo[] = [];

  const searchDirs = [
    join(LOCALAPPDATA, 'Programs'),
    join(APPDATA),
    PROGRAMFILES,
    PROGRAMFILESX86,
  ];

  for (const appDir of searchDirs) {
    if (!(await exists(appDir))) continue;

    try {
      const entries = await readdir(appDir);

      for (const entry of entries) {
        if (entry.startsWith('.')) continue;
        if (entry.startsWith('Microsoft')) continue;
        if (entry.startsWith('Windows')) continue;

        const appPath = join(appDir, entry);

        try {
          const stats = await stat(appPath);
          if (!stats.isDirectory()) continue;

          const appSize = await getSize(appPath);
          if (appSize < 1024 * 1024) continue;

          const relatedPaths = await findRelatedPaths(entry);

          let totalRelatedSize = 0;
          for (const path of relatedPaths) {
            totalRelatedSize += await getSize(path).catch(() => 0);
          }

          const existingApp = apps.find(a => a.name === entry);
          if (!existingApp) {
            apps.push({
              name: entry,
              path: appPath,
              size: appSize,
              relatedPaths,
              totalSize: appSize + totalRelatedSize,
            });
          }
        } catch {
          continue;
        }
      }
    } catch {
      continue;
    }
  }

  return apps.sort((a, b) => b.totalSize - a.totalSize);
}

async function findRelatedPaths(appName: string): Promise<string[]> {
  const paths: string[] = [];

  for (const template of RELATED_PATHS_TEMPLATES) {
    const variations = [
      template.replace('{APP_NAME}', appName),
      template.replace('{APP_NAME}', appName.toLowerCase()),
      template.replace('{APP_NAME}', appName.replace(/\s+/g, '')),
    ];

    for (const path of variations) {
      if (await exists(path)) {
        if (!paths.includes(path)) {
          paths.push(path);
        }
      }
    }
  }

  return paths;
}

