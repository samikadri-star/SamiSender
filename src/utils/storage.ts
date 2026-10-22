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

export const INITIAL_HISTORY: HistoryRecord[] = [
  {
    id: 'hist-1',
    name: 'مشروع_تطبيق_كوتلن_النهائي',
    isFolder: true,
    itemsCount: 48,
    size: 324 * 1024 * 1024, // 324 MB
    direction: 'send',
    peerName: 'لابتوب ديل XPS 15 (سامي)',
    peerIp: '192.168.1.105',
    timestamp: Date.now() - 1000 * 60 * 35, // 35 mins ago
    durationSeconds: 6.8,
    avgSpeedFormatted: '47.6 MB/s',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'success',
    savePath: '/storage/emulated/0/Download/WiFiShare_Sami/',
  },
  {
    id: 'hist-2',
    name: 'فيديو_شرح_تقنية_الواي_فاي_دايركت.mp4',
    isFolder: false,
    itemsCount: 1,
    size: 840 * 1024 * 1024, // 840 MB
    direction: 'receive',
    peerName: 'شاومي 14 برو (صنعاء)',
    peerIp: '192.168.1.112',
    timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
    durationSeconds: 16.2,
    avgSpeedFormatted: '51.8 MB/s',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    status: 'success',
    savePath: '/storage/emulated/0/Download/WiFiShare_Sami/Videos/',
  },
  {
    id: 'hist-3',
    name: 'حزمة_أيقونات_ماتيريال_ديزاين_3.zip',
    isFolder: false,
    itemsCount: 1,
    size: 45 * 1024 * 1024, // 45 MB
    direction: 'send',
    peerName: 'آيباد برو M2',
    peerIp: '192.168.1.140',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // Yesterday
    durationSeconds: 1.1,
    avgSpeedFormatted: '40.9 MB/s',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    status: 'success',
    savePath: '/storage/emulated/0/Download/WiFiShare_Sami/',
  },
];

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fall back to sample
  }
  return INITIAL_HISTORY;
}

export function saveHistory(records: HistoryRecord[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  } catch {
    // Ignore quota
  }
}

export const INITIAL_NEARBY_DEVICES: DevicePeer[] = [
  {
    id: 'dev-1',
    name: 'لابتوب سامي القادري (Windows 11)',
    deviceType: 'pc',
    ipAddress: '192.168.1.105',
    port: 8888,
    signalStrength: 98,
    frequency: '5 GHz (Wi-Fi 6)',
    status: 'available',
    avatarColor: '#4F46E5',
  },
  {
    id: 'dev-2',
    name: 'سامسونج جالاكسي تاب S9',
    deviceType: 'android',
    ipAddress: '192.168.1.118',
    port: 8888,
    signalStrength: 92,
    frequency: '5 GHz (Wi-Fi 6)',
    status: 'available',
    avatarColor: '#059669',
  },
  {
    id: 'dev-3',
    name: 'جهاز ردمي نوت 13 برو',
    deviceType: 'android',
    ipAddress: '192.168.1.144',
    port: 8888,
    signalStrength: 78,
    frequency: '2.4 GHz',
    status: 'available',
    avatarColor: '#D97706',
  },
  {
    id: 'dev-4',
    name: 'ماك بوك إير M3 (المكتب)',
    deviceType: 'mac',
    ipAddress: '192.168.1.160',
    port: 8888,
    signalStrength: 85,
    frequency: '5 GHz (Wi-Fi 5)',
    status: 'available',
    avatarColor: '#9333EA',
  },
];
