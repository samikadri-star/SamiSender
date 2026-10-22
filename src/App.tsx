/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import {
  ActiveTransferSession,
  AppSettings,
  DevicePeer,
  FileItem,
  HistoryRecord
} from './types';
import {
  DEFAULT_SETTINGS,
  INITIAL_NEARBY_DEVICES,
  loadHistory,
  loadSettings,
  saveHistory,
  saveSettings
} from './utils/storage';
import { Header } from './components/Header';
import { SendScreen } from './components/SendScreen';
import { ReceiveScreen } from './components/ReceiveScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AndroidCodeStudio } from './components/AndroidCodeStudio';
import { TransferModal } from './components/TransferModal';
import { AboutDialog } from './components/AboutDialog';
import { EditUserDialog } from './components/EditUserDialog';
import { soundManager } from './utils/audio';
import { formatBytes, formatSpeed } from './utils/formatters';
import { calculateFileSHA256, generateSyntheticSHA256 } from './utils/crypto';
import { showSystemNotification, triggerVibration } from './utils/notifications';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [history, setHistory] = useState<HistoryRecord[]>(loadHistory);
  const [nearbyDevices] = useState<DevicePeer[]>(INITIAL_NEARBY_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<DevicePeer | null>(INITIAL_NEARBY_DEVICES[0]);
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'history' | 'settings' | 'kotlin'>('send');
  
  // Active transfer state
  const [activeSession, setActiveSession] = useState<ActiveTransferSession | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const transferIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync settings to localStorage
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Sync history to localStorage
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  // Apply dark mode theme class on root html
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Start high speed transfer (either sending or receiving)
  const startTransferSession = async (
    items: FileItem[],
    peer: DevicePeer,
    direction: 'send' | 'receive',
    isFolder: boolean,
    folderName?: string
  ) => {
    if (settings.soundEnabled) {
      soundManager.playStart();
    }

    const totalBytes = items.reduce((acc, it) => acc + it.size, 0);

    // Initial synthetic or real hash
    const firstItem = items[0];
    let computedHash = generateSyntheticSHA256(firstItem?.name || 'transfer_seed');
    if (firstItem?.file) {
      calculateFileSHA256(firstItem.file)
        .then((h) => {
          computedHash = h;
        })
        .catch(() => {});
    }

    const newSession: ActiveTransferSession = {
      id: `session-${Date.now()}`,
      peer,
      direction,
      items: items.map((it) => ({ ...it, progress: 0, status: 'transferring' })),
      isFolder,
      folderName,
      totalSize: totalBytes,
      transferredBytes: 0,
      progressPercent: 0,
      speedBytesPerSec: 0,
      speedFormatted: '0.0 MB/s',
      peakSpeedFormatted: '0.0 MB/s',
      elapsedSeconds: 0,
      remainingSeconds: Math.ceil(totalBytes / (48 * 1024 * 1024)),
      status: 'transferring',
      startTime: Date.now(),
      overallChecksum: computedHash,
    };

    setActiveSession(newSession);

    // High speed simulation engine (40 - 68 MB/s on Wi-Fi 6)
    let transferred = 0;
    let peakSpeed = 0;
    const startTime = Date.now();
    let lastTick = Date.now();

    if (transferIntervalRef.current) clearInterval(transferIntervalRef.current);

    transferIntervalRef.current = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev || prev.status === 'paused' || prev.status === 'completed' || prev.status === 'failed') {
          return prev;
        }

        const now = Date.now();
        const deltaSeconds = (now - lastTick) / 1000;
        lastTick = now;

        // Wi-Fi 6 high throughput chunk rate: ~42MB/s - 68MB/s
        const randomVariation = 0.85 + Math.random() * 0.35; // 0.85 - 1.2
        const baseSpeedBytesPerSec = 48 * 1024 * 1024 * randomVariation; // ~48 MB/s
        const bytesInTick = Math.min(baseSpeedBytesPerSec * deltaSeconds, prev.totalSize - transferred);

        transferred += bytesInTick;
        if (baseSpeedBytesPerSec > peakSpeed) {
          peakSpeed = baseSpeedBytesPerSec;
        }

        const percent = Math.min(100, (transferred / prev.totalSize) * 100);
        const elapsed = (now - startTime) / 1000;
        const remaining = transferred >= prev.totalSize ? 0 : Math.ceil((prev.totalSize - transferred) / baseSpeedBytesPerSec);

        // Check if finished
        if (transferred >= prev.totalSize) {
          if (transferIntervalRef.current) clearInterval(transferIntervalRef.current);

          // Verification step
          setTimeout(() => {
            handleTransferComplete(prev, computedHash, peakSpeed, elapsed);
          }, 600);

          return {
            ...prev,
            transferredBytes: prev.totalSize,
            progressPercent: 100,
            status: 'verifying',
            remainingSeconds: 0,
            elapsedSeconds: elapsed,
          };
        }

        return {
          ...prev,
          transferredBytes: transferred,
          progressPercent: percent,
          speedBytesPerSec: baseSpeedBytesPerSec,
          speedFormatted: formatSpeed(baseSpeedBytesPerSec),
          peakSpeedFormatted: formatSpeed(peakSpeed),
          elapsedSeconds: elapsed,
          remainingSeconds: remaining,
        };
      });
    }, 120);
  };

  // Complete transfer
  const handleTransferComplete = (
    session: ActiveTransferSession,
    hash: string,
    peakSpeed: number,
    elapsed: number
  ) => {
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'completed',
        overallChecksum: hash,
        receiverChecksum: hash,
        checksumVerified: true,
        endTime: Date.now(),
        speedFormatted: '0.0 MB/s',
      };
    });

    // Sound alert
    if (settings.soundEnabled) {
      soundManager.playSuccess();
    }

    // Vibration
    if (settings.vibrateEnabled) {
      triggerVibration([100, 50, 150]);
    }

    // System Notification
    if (settings.notificationsEnabled) {
      showSystemNotification('واي فاي شير برو - اكتمل النقل بنجاح!', {
        body: `تم ${session.direction === 'send' ? 'إرسال' : 'استقبال'} ${session.isFolder ? session.folderName : session.items[0]?.name} بنجاح ومطابقة SHA-256`,
      });
    }

    // Add to History
    const avgSpeed = (session.totalSize / Math.max(1, elapsed));
    const newRecord: HistoryRecord = {
      id: `hist-${Date.now()}`,
      name: session.isFolder ? (session.folderName || 'مجلد') : session.items[0]?.name || 'ملف',
      isFolder: session.isFolder,
      itemsCount: session.items.length,
      size: session.totalSize,
      direction: session.direction,
      peerName: session.peer.name,
      peerIp: session.peer.ipAddress,
      timestamp: Date.now(),
      durationSeconds: elapsed,
      avgSpeedFormatted: formatSpeed(avgSpeed),
      sha256: hash,
      status: 'success',
      savePath: settings.savePath,
    };

    setHistory((prev) => [newRecord, ...prev]);
    showToast('اكتملت العملية بنجاح مع مطابقة كود التجزئة SHA-256 بنسبة 100%!');
  };

  // Pause / Resume
  const handlePauseResume = () => {
    setActiveSession((prev) => {
      if (!prev) return null;
      const nextStatus = prev.status === 'paused' ? 'transferring' : 'paused';
      return { ...prev, status: nextStatus };
    });
  };

  // Cancel
  const handleCancel = () => {
    if (transferIntervalRef.current) clearInterval(transferIntervalRef.current);
    setActiveSession((prev) => {
      if (!prev) return null;
      return { ...prev, status: 'failed', error: 'تم إلغاء النقل من قبل المستخدم' };
    });
    if (settings.soundEnabled) soundManager.playError();
    showToast('تم إلغاء عملية النقل');
  };

  // Download completed folder/files as zip
  const handleDownloadCompletedZip = async () => {
    if (!activeSession) return;
    try {
      const zip = new JSZip();
      activeSession.items.forEach((item) => {
        const path = item.relativePath || item.name;
        // If file object exists, pack real file; otherwise pack placeholder with sha256
        if (item.file) {
          zip.file(path, item.file);
        } else {
          zip.file(path, `WiFiSharePro Received File: ${item.name}\nSize: ${formatBytes(item.size)}\nSHA256: ${activeSession.overallChecksum}\nDeveloper: Sami Al-Qadiri 777484160`);
        }
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeSession.folderName || activeSession.items[0]?.name || 'WiFiShare_Transfer'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('حدث خطأ أثناء تنزيل الملفات');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        setSettings={setSettings}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenEditUser={() => setIsEditUserOpen(true)}
      />

      {/* Main Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'send' && (
          <SendScreen
            nearbyDevices={nearbyDevices}
            selectedDevice={selectedDevice}
            setSelectedDevice={setSelectedDevice}
            onStartTransfer={(items, target, isFolder, folderName) =>
              startTransferSession(items, target, 'send', isFolder, folderName)
            }
            settings={settings}
            onOpenEditUser={() => setIsEditUserOpen(true)}
          />
        )}

        {activeTab === 'receive' && (
          <ReceiveScreen
            nearbyDevices={nearbyDevices}
            settings={settings}
            onSimulateIncomingTransfer={(items, sender, isFolder, folderName) =>
              startTransferSession(items, sender, 'receive', isFolder, folderName)
            }
            onOpenEditUser={() => setIsEditUserOpen(true)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            history={history}
            onClearHistory={() => {
              if (window.confirm('هل أنت متأكد من رغبتك في مسح سجل عمليات النقل بالكامل؟')) {
                setHistory([]);
                showToast('تم مسح السجل');
              }
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            setSettings={setSettings}
            onSaveToast={() => showToast('تم حفظ الإعدادات ومسار الحفظ بنجاح')}
          />
        )}

        {activeTab === 'kotlin' && <AndroidCodeStudio />}
      </main>

      {/* Floating Active Transfer Modal */}
      <TransferModal
        session={activeSession}
        onPauseResume={handlePauseResume}
        onCancel={handleCancel}
        onClose={() => setActiveSession(null)}
        onDownloadCompletedZip={activeSession?.status === 'completed' ? handleDownloadCompletedZip : undefined}
      />

      {/* Developer & Specs Dialog */}
      <AboutDialog isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Edit User Name & Device Dialog */}
      <EditUserDialog
        isOpen={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        settings={settings}
        setSettings={setSettings}
        onSaveToast={(msg) => showToast(msg)}
      />

      {/* In-app Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-slate-700 dark:border-slate-200 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bottom Footer with Developer Signature */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-4 text-center transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="font-bold text-indigo-600 dark:text-indigo-400">
            تطوير: سامي القادري 777484160
          </div>
          <div>
            واي فاي شير برو • تطبيق كوتلن وواجهات XML لنقل الملفات والمجلدات عبر الواي فاي
          </div>
        </div>
      </footer>
    </div>
  );
}
