import React, { useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  X,
  ShieldCheck,
  FolderTree,
  FileText,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveTransferSession } from '../types';
import { formatBytes, formatDuration } from '../utils/formatters';

interface TransferModalProps {
  session: ActiveTransferSession | null;
  onPauseResume: () => void;
  onCancel: () => void;
  onClose: () => void;
  onDownloadCompletedZip?: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  session,
  onPauseResume,
  onCancel,
  onClose,
  onDownloadCompletedZip,
}) => {
  const [copiedHash, setCopiedHash] = React.useState(false);

  useEffect(() => {
    if (session?.status === 'completed') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6'],
        });
      } catch {
        // Confetti optional
      }
    }
  }, [session?.status]);

  if (!session) return null;

  const isCompleted = session.status === 'completed';
  const isFailed = session.status === 'failed';
  const isPaused = session.status === 'paused';
  const isVerifying = session.status === 'verifying';

  const copyHashToClipboard = () => {
    if (session.overallChecksum) {
      navigator.clipboard.writeText(session.overallChecksum);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
        {/* Top Header */}
        <div
          className={`p-6 text-white transition-colors ${
            isCompleted
              ? 'bg-linear-to-r from-emerald-600 to-teal-700'
              : isFailed
              ? 'bg-linear-to-r from-rose-600 to-red-700'
              : 'bg-linear-to-r from-indigo-700 to-blue-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                {session.direction === 'send' ? (
                  <ArrowUpRight className="w-6 h-6" />
                ) : (
                  <ArrowDownLeft className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                  {session.direction === 'send' ? 'عملية إرسال جارية' : 'عملية استقبال جارية'}
                </span>
                <h3 className="text-lg font-bold leading-tight truncate max-w-[280px] sm:max-w-md">
                  {session.isFolder ? `مجلد: ${session.folderName || 'مجلد'}` : session.items[0]?.name}
                </h3>
              </div>
            </div>

            {/* Close button if finished */}
            {(isCompleted || isFailed) && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Target Peer & Speed Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            {/* Speedometer */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>سرعة النقل</span>
              </span>
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
                {isCompleted ? 'مكتمل' : session.speedFormatted}
              </p>
              <span className="text-[10px] text-slate-400">
                الذروة: {session.peakSpeedFormatted}
              </span>
            </div>

            {/* ETA Countdown */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>الوقت المتبقي</span>
              </span>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">
                {isCompleted ? '00:00' : formatDuration(session.remainingSeconds)}
              </p>
              <span className="text-[10px] text-slate-400">
                المنقضي: {formatDuration(session.elapsedSeconds)}
              </span>
            </div>

            {/* Target Device */}
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                الجهاز المقترن
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                {session.peer.name}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                {session.peer.ipAddress}
              </span>
            </div>
          </div>

          {/* Accurate Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  حالة النقل الإجمالية
                </span>
                {session.isFolder && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                    مجلد ({session.items.length} ملفات)
                  </span>
                )}
              </div>
              <span className="font-black font-mono text-base text-indigo-600 dark:text-indigo-400">
                {session.progressPercent.toFixed(1)}%
              </span>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${
                  isCompleted
                    ? 'bg-linear-to-r from-emerald-500 to-teal-400'
                    : isFailed
                    ? 'bg-rose-500'
                    : 'bg-linear-to-r from-indigo-600 to-blue-500'
                }`}
                style={{ width: `${session.progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>{formatBytes(session.transferredBytes)} تم نقلها</span>
              <span>الحجم الإجمالي: {formatBytes(session.totalSize)}</span>
            </div>
          </div>

          {/* SHA-256 Checksum Verification Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className={`w-5 h-5 ${
                    isCompleted && session.checksumVerified
                      ? 'text-emerald-500 animate-bounce'
                      : 'text-indigo-500'
                  }`}
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  فحص سلامة البيانات (SHA-256 Integrity Verification)
                </span>
              </div>

              {isCompleted && session.checksumVerified && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  مطابق 100% بنجاح
                </span>
              )}

              {isVerifying && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                  جاري مطابقة التجزئة...
                </span>
              )}
            </div>

            {session.overallChecksum ? (
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <span className="truncate">{session.overallChecksum}</span>
                <button
                  onClick={copyHashToClipboard}
                  className="shrink-0 p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="نسخ كود الهاش"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                يتم حساب بصمة التجزئة الرقمية عبر مقابس الواي فاي للتحقق فور اكتمال النقل...
              </p>
            )}
          </div>

          {/* Individual files status preview for folder transfer */}
          {session.isFolder && session.items.length > 1 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                عناصر المجلد الجاري نقلها:
              </span>
              <div className="max-h-32 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1 text-xs">
                {session.items.map((file) => (
                  <div key={file.id} className="py-1.5 flex items-center justify-between gap-2">
                    <span className="truncate text-slate-700 dark:text-slate-300">
                      {file.name}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls / Actions */}
          <div className="flex items-center gap-3 pt-2">
            {!isCompleted && !isFailed && (
              <>
                <button
                  onClick={onPauseResume}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isPaused ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4" />}
                  <span>{isPaused ? 'استئناف النقل' : 'إيقاف مؤقت'}</span>
                </button>

                <button
                  onClick={onCancel}
                  className="py-3 px-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>إلغاء</span>
                </button>
              </>
            )}

            {isCompleted && (
              <>
                {onDownloadCompletedZip && (
                  <button
                    onClick={onDownloadCompletedZip}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل الملفات المستلمة</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم وإغلاق النافذة</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
