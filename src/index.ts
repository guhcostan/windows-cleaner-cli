#!/usr/bin/env node

import { Command } from 'commander';
import { interactiveCommand, listCategories, maintenanceCommand, uninstallCommand } from './commands/index.js';
import { initConfig, configExists, listBackups, cleanOldBackups, loadConfig, formatSize } from './utils/index.js';

const program = new Command();

program
  .name('windows-cleaner')
  .description('Open source CLI tool to clean your Windows PC')
  .version('1.0.0')
  .option('-r, --risky', 'Include risky categories (downloads, iTunes backups, etc)')
  .option('--no-progress', 'Disable progress bar')
  .action(async (options) => {
    await interactiveCommand({
      includeRisky: options.risky,
      noProgress: !options.progress,
    });
  });

program
  .command('uninstall')
  .description('Remove applications and their related files')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-d, --dry-run', 'Show what would be removed without actually removing')
  .option('--no-progress', 'Disable progress bar')
  .action(async (options) => {
    await uninstallCommand({
      yes: options.yes,
      dryRun: options.dryRun,
      noProgress: !options.progress,
    });
  });

program
  .command('maintenance')
  .description('Run maintenance tasks (DNS flush, disk cleanup, etc)')
  .option('--dns', 'Flush DNS cache')
  .option('--disk', 'Run Windows Disk Cleanup')
  .option('--thumbnails', 'Clear thumbnail cache')
  .option('--fonts', 'Clear font cache (requires admin)')
  .action(async (options) => {
    await maintenanceCommand({
      dns: options.dns,
      diskCleanup: options.disk,
      thumbnails: options.thumbnails,
      fonts: options.fonts,
    });
  });

program
  .command('categories')
  .description('List all available categories')
  .action(() => {
    listCategories();
  });

program
  .command('config')
  .description('Manage configuration')
  .option('--init', 'Create default configuration file')
  .option('--show', 'Show current configuration')
  .action(async (options) => {
    if (options.init) {
      const exists = await configExists();
      if (exists) {
        console.log('Configuration file already exists.');
        return;
      }
      const path = await initConfig();
      console.log(`Created configuration file at: ${path}`);
      return;
    }

    if (options.show) {
      const exists = await configExists();
      if (!exists) {
        console.log('No configuration file found. Run "windows-cleaner-cli config --init" to create one.');
        return;
      }
      const config = await loadConfig();
      console.log(JSON.stringify(config, null, 2));
      return;
    }

    console.log('Use --init to create config or --show to display current config.');
  });

program
  .command('backup')
  .description('Manage backups')
  .option('--list', 'List all backups')
  .option('--clean', 'Clean old backups (older than 7 days)')
  .action(async (options) => {
    if (options.list) {
      const backups = await listBackups();
      if (backups.length === 0) {
        console.log('No backups found.');
        return;
      }
      console.log('\nBackups:');
      for (const backup of backups) {
        console.log(`  ${backup.date.toLocaleDateString()} - ${formatSize(backup.size)}`);
        console.log(`    ${backup.path}`);
      }
      return;
    }

    if (options.clean) {
      const cleaned = await cleanOldBackups();
      console.log(`Cleaned ${cleaned} old backups.`);
      return;
    }

    console.log('Use --list to show backups or --clean to remove old ones.');
  });

program.parse();

