/**
 * Formatting helpers for bytes, speed, time, and file types
 */

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${val} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec <= 0) return '0.0 MB/s';
  const mbPerSec = bytesPerSec / (1024 * 1024);
  if (mbPerSec >= 1) {
    return `${mbPerSec.toFixed(1)} MB/s`;
  }
  const kbPerSec = bytesPerSec / 1024;
  return `${kbPerSec.toFixed(1)} KB/s`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0 || !isFinite(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('ar-EG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getFileCategory(filename: string, mimeType?: string): 'video' | 'audio' | 'image' | 'archive' | 'document' | 'code' | 'other' {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (['mp4', 'mkv', 'mov', 'avi', 'wmv', 'flv', 'webm'].includes(ext) || mimeType?.startsWith('video/')) {
    return 'video';
  }
  if (['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(ext) || mimeType?.startsWith('audio/')) {
    return 'audio';
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext) || mimeType?.startsWith('image/')) {
    return 'image';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'apk', 'obb', 'iso'].includes(ext)) {
    return 'archive';
  }
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext) || mimeType?.startsWith('application/pdf')) {
    return 'document';
  }
  if (['kt', 'java', 'xml', 'ts', 'js', 'json', 'py', 'html', 'css', 'cpp', 'c', 'cs'].includes(ext)) {
    return 'code';
  }
  return 'other';
}
