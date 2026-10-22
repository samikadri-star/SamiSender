import React from 'react';
import {
  Download,
  X,
  ShieldCheck,
  FolderTree,
  FileText,
  Smartphone,
  Check,
  Zap
} from 'lucide-react';
import { IncomingTransferOffer } from '../utils/realTransferEngine';
import { formatBytes } from '../utils/formatters';

interface IncomingTransferDialogProps {
  offer: IncomingTransferOffer | null;
  onAccept: (offer: IncomingTransferOffer) => void;
  onDecline: (offer: IncomingTransferOffer) => void;
}

export const IncomingTransferDialog: React.FC<IncomingTransferDialogProps> = ({
  offer,
  onAccept,
  onDecline,
}) => {
  if (!offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                طلب استقبال ملف وارد
              </span>
              <h3 className="text-lg font-bold leading-tight">
                {offer.senderName} يود إرسال بيانات إليك
              </h3>
            </div>
          </div>

          <button
            onClick={() => onDecline(offer)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Sender profile */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0"
              style={{ backgroundColor: offer.senderAvatar || '#4F46E5' }}
            >
              {offer.senderName.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {offer.senderName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {offer.senderDevice} • عبر اتصال الواي فاي المباشر
              </p>
            </div>
          </div>

          {/* Transfer details */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              {offer.isFolder ? (
                <FolderTree className="w-5 h-5 text-emerald-500" />
              ) : (
                <FileText className="w-5 h-5 text-indigo-500" />
              )}
              <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                {offer.isFolder ? `مجلد: ${offer.folderName}` : offer.items[0]?.name}
              </h4>
            </div>

            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>عدد العناصر: {offer.items.length}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                الحجم: {formatBytes(offer.totalSize)}
              </span>
            </div>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>سيتم التحقق التلقائي من بصمة SHA-256 للتأكد من سلامة البيانات فور الاكتمال.</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onDecline(offer)}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              رفض الاستلام
            </button>
            <button
              onClick={() => onAccept(offer)}
              className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>قبول واستقبال الملفات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
