import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface MaintenanceResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function runDiskCleanup(): Promise<MaintenanceResult> {
  try {
    await execAsync('cleanmgr /sagerun:1', { shell: 'cmd.exe' });

    return {
      success: true,
      message: 'Disk Cleanup completed successfully',
    };
  } catch {
    try {
      await execAsync('cleanmgr /d C:', { shell: 'cmd.exe' });

      return {
        success: true,
        message: 'Disk Cleanup launched (manual selection required)',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to run Disk Cleanup',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export async function clearThumbnailCache(): Promise<MaintenanceResult> {
  try {
    await execAsync('del /f /s /q %LocalAppData%\\Microsoft\\Windows\\Explorer\\thumbcache_*.db', {
      shell: 'cmd.exe',
    });

    return {
      success: true,
      message: 'Thumbnail cache cleared successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to clear thumbnail cache',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function clearFontCache(): Promise<MaintenanceResult> {
  try {
    await execAsync('net stop FontCache', { shell: 'cmd.exe' });
    await execAsync('del /f /s /q %WinDir%\\ServiceProfiles\\LocalService\\AppData\\Local\\FontCache\\*', {
      shell: 'cmd.exe',
    });
    await execAsync('net start FontCache', { shell: 'cmd.exe' });

    return {
      success: true,
      message: 'Font cache cleared successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to clear font cache (may require admin)',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

