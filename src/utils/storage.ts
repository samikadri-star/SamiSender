import { AppSettings, DevicePeer, HistoryRecord } from '../types';

const SETTINGS_KEY = 'wifi_share_settings_v1';
const HISTORY_KEY = 'wifi_share_history_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  savePath: '/storage/emulated/0/Download/WiFiShare_Sami/',
  autoSaveToDownloads: true,
  autoCategorizeByType: true,
  chunkSizeKB: 1024, // 1MB chunks for ultra-high speed
  soundEnabled: true,
  notificationsEnabled: true,
  vibrateEnabled: true,
  autoAcceptFromKnown: false,
  wifiBand: '5ghz',
  port: 8888,
  deviceName: 'هاتف سامسونج جالاكسي S24 ألترا',
  userName: 'سامي القادري',
  userAvatarColor: '#4F46E5',
  theme: 'dark',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // Return defaults on error
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota
  }
}

// Empty initial data - only real transfers and real discovered peers will be shown
export const INITIAL_HISTORY: HistoryRecord[] = [];

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Return empty array
  }
  return [];
}

export function saveHistory(records: HistoryRecord[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  } catch {
    // Ignore quota
  }
}

export const INITIAL_NEARBY_DEVICES: DevicePeer[] = [];

