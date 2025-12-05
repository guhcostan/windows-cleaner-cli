import chalk from 'chalk';
import ora from 'ora';
import { flushDnsCache, runDiskCleanup, clearThumbnailCache, clearFontCache, type MaintenanceResult } from '../maintenance/index.js';

interface MaintenanceCommandOptions {
  dns?: boolean;
  diskCleanup?: boolean;
  thumbnails?: boolean;
  fonts?: boolean;
}

export async function maintenanceCommand(options: MaintenanceCommandOptions): Promise<void> {
  const tasks: { name: string; fn: () => Promise<MaintenanceResult> }[] = [];

  if (options.dns) {
    tasks.push({ name: 'Flush DNS Cache', fn: flushDnsCache });
  }

  if (options.diskCleanup) {
    tasks.push({ name: 'Run Disk Cleanup', fn: runDiskCleanup });
  }

  if (options.thumbnails) {
    tasks.push({ name: 'Clear Thumbnail Cache', fn: clearThumbnailCache });
  }

  if (options.fonts) {
    tasks.push({ name: 'Clear Font Cache', fn: clearFontCache });
  }

  if (tasks.length === 0) {
    console.log(chalk.yellow('\nNo maintenance tasks specified.'));
    console.log(chalk.dim('Available options:'));
    console.log(chalk.dim('  --dns        Flush DNS cache'));
    console.log(chalk.dim('  --disk       Run Windows Disk Cleanup'));
    console.log(chalk.dim('  --thumbnails Clear thumbnail cache'));
    console.log(chalk.dim('  --fonts      Clear font cache (requires admin)\n'));
    return;
  }

  console.log();
  console.log(chalk.bold('Running Maintenance Tasks'));
  console.log(chalk.dim('─'.repeat(50)));

  for (const task of tasks) {
    const spinner = ora(task.name).start();

    const result = await task.fn();

    if (result.success) {
      spinner.succeed(chalk.green(result.message));
    } else {
      if (result.error) {
        spinner.fail(chalk.red(`${result.message}: ${result.error}`));
      } else {
        spinner.fail(chalk.red(result.message));
      }
    }
  }

  console.log();
}

