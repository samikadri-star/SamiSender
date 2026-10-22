export type TransferStatus = 'idle' | 'discovering' | 'connecting' | 'preparing' | 'transferring' | 'verifying' | 'completed' | 'failed' | 'paused';

export type TransferType = 'send' | 'receive';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  relativePath?: string; // For folders: e.g. "MyProject/assets/logo.png"
  file?: File; // Browser File object if picked
  progress: number;
  status: 'pending' | 'transferring' | 'completed' | 'failed';
  sha256?: string;
  receiverSha256?: string;
  hashMatched?: boolean;
}

export interface DevicePeer {
  id: string;
  name: string;
  deviceType: 'android' | 'ios' | 'pc' | 'mac';
  ipAddress: string;
  port: number;
  signalStrength: number; // 1-100%
  frequency: '5 GHz (Wi-Fi 6)' | '5 GHz (Wi-Fi 5)' | '2.4 GHz';
  status: 'available' | 'busy' | 'connected';
  avatarColor: string;
}

export interface ActiveTransferSession {
  id: string;
  peer: DevicePeer;
  direction: TransferType;
  items: FileItem[];
  isFolder: boolean;
  folderName?: string;
  totalSize: number;
  transferredBytes: number;
  progressPercent: number; // 0 - 100
  speedBytesPerSec: number; // Bytes / s
  speedFormatted: string; // e.g. "48.2 MB/s"
  peakSpeedFormatted: string;
  elapsedSeconds: number;
  remainingSeconds: number;
  status: TransferStatus;
  startTime: number;
  endTime?: number;
  overallChecksum?: string;
  receiverChecksum?: string;
  checksumVerified?: boolean;
  error?: string;
}

export interface HistoryRecord {
  id: string;
  name: string;
  isFolder: boolean;
  itemsCount: number;
  size: number;
  direction: TransferType;
  peerName: string;
  peerIp: string;
  timestamp: number;
  durationSeconds: number;
  avgSpeedFormatted: string;
  sha256: string;
  status: 'success' | 'failed';
  savePath: string;
}

export interface AppSettings {
  savePath: string;
  autoSaveToDownloads: boolean;
  autoCategorizeByType: boolean;
  chunkSizeKB: number; // 64, 256, 1024, 4096
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  vibrateEnabled: boolean;
  autoAcceptFromKnown: boolean;
  wifiBand: '5ghz' | '2.4ghz' | 'auto';
  port: number;
  deviceName: string;
  theme: 'dark' | 'light' | 'system';
}

export interface KotlinCodeFile {
  name: string;
  path: string;
  type: 'kotlin' | 'xml' | 'gradle' | 'json';
  category: 'ui' | 'network' | 'service' | 'model' | 'layout' | 'values' | 'config';
  description: string;
  content: string;
}
