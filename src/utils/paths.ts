import { homedir } from 'os';
import { join } from 'path';

export const HOME = homedir();

const APPDATA = process.env.APPDATA || join(HOME, 'AppData', 'Roaming');
const LOCALAPPDATA = process.env.LOCALAPPDATA || join(HOME, 'AppData', 'Local');
const WINDIR = process.env.WINDIR || 'C:\\Windows';

export const PATHS = {
  userCaches: join(LOCALAPPDATA, 'Temp'),
  systemTemp: join(WINDIR, 'Temp'),
  userTemp: process.env.TEMP || join(LOCALAPPDATA, 'Temp'),
  userLogs: join(LOCALAPPDATA, 'CrashDumps'),
  systemLogs: join(WINDIR, 'Logs'),
  eventLogs: join(WINDIR, 'System32', 'winevt', 'Logs'),
  downloads: join(HOME, 'Downloads'),
  documents: join(HOME, 'Documents'),

  chromeCache: join(LOCALAPPDATA, 'Google', 'Chrome', 'User Data', 'Default', 'Cache'),
  chromeCacheData: join(LOCALAPPDATA, 'Google', 'Chrome', 'User Data', 'Default', 'Code Cache'),
  edgeCache: join(LOCALAPPDATA, 'Microsoft', 'Edge', 'User Data', 'Default', 'Cache'),
  firefoxProfiles: join(LOCALAPPDATA, 'Mozilla', 'Firefox', 'Profiles'),
  braveCache: join(LOCALAPPDATA, 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default', 'Cache'),

  npmCache: join(APPDATA, 'npm-cache'),
  yarnCache: join(LOCALAPPDATA, 'Yarn', 'Cache'),
  pnpmCache: join(LOCALAPPDATA, 'pnpm', 'store'),
  pipCache: join(LOCALAPPDATA, 'pip', 'Cache'),
  nugetCache: join(HOME, '.nuget', 'packages'),
  gradleCache: join(HOME, '.gradle', 'caches'),
  cargoCache: join(HOME, '.cargo', 'registry'),

  chocolateyCache: 'C:\\ProgramData\\chocolatey\\cache',
  scoopCache: join(HOME, 'scoop', 'cache'),

  itunesBackups: join(APPDATA, 'Apple Computer', 'MobileSync', 'Backup'),
  appleBackupsAlt: join(HOME, 'Apple', 'MobileSync', 'Backup'),

  windowsUpdate: join(WINDIR, 'SoftwareDistribution', 'Download'),
  prefetch: join(WINDIR, 'Prefetch'),

  recycleBin: '$Recycle.Bin',

  programFiles: process.env.ProgramFiles || 'C:\\Program Files',
  programFilesX86: process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)',
};

export function expandPath(path: string): string {
  if (path.startsWith('~')) {
    return path.replace('~', HOME);
  }
  return path;
}

export function isSystemPath(path: string): boolean {
  const systemPaths = [
    'C:\\Windows\\System32',
    'C:\\Windows\\SysWOW64',
    'C:\\Windows\\WinSxS',
    'C:\\Program Files\\WindowsApps',
  ];
  return systemPaths.some((p) => path.toLowerCase().startsWith(p.toLowerCase()));
}

