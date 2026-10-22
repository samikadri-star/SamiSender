import React, { useState } from 'react';
import {
  History,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  FolderTree,
  FileText,
  ShieldCheck,
  Download,
  Trash2,
  FileSpreadsheet,
  Copy,
  Check,
  CheckCircle2,
  Film,
  Music,
  Archive,
  Image as ImageIcon
} from 'lucide-react';
import { HistoryRecord } from '../types';
import { formatBytes, formatDateTime, getFileCategory } from '../utils/formatters';

interface HistoryScreenProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'folders'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'send' && item.direction === 'send') ||
      (filter === 'receive' && item.direction === 'receive') ||
      (filter === 'folders' && item.isFolder);

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.peerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sha256.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCopySha256 = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WiFiShare_History_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getIconForFile = (name: string, isFolder: boolean) => {
    if (isFolder) return <FolderTree className="w-5 h-5 text-emerald-500" />;
    const cat = getFileCategory(name);
    switch (cat) {
      case 'video': return <Film className="w-5 h-5 text-rose-500" />;
      case 'audio': return <Music className="w-5 h-5 text-amber-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case 'archive': return <Archive className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <History className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold">سجل عمليات النقل السابقة</h2>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            مراجعة كافة الملفات والمجلدات المرسلة والمستقبلة مع تفاصيل السرعة والوقت وتأكيد سلامة تجزئة SHA-256.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAsJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all cursor-pointer border border-white/10"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>تصدير السجل JSON</span>
          </button>
          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-all cursor-pointer border border-rose-500/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>مسح السجل</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          {[
            { id: 'all' as const, label: 'الكل' },
            { id: 'send' as const, label: 'المرسلة' },
            { id: 'receive' as const, label: 'المستقبلة' },
            { id: 'folders' as const, label: 'المجلدات فقط' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو الجهاز أو SHA-256..."
            className="w-full pr-10 pl-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* History Records List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <History className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            لا توجد سجلات مطابقة
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            ستظهر هنا جميع عمليات النقل بعد إرسال أو استقبال الملفات عبر شبكة الواي فاي.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-200 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5 sm:mt-0">
                  {getIconForFile(item.name, item.isFolder)}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                      {item.name}
                    </h4>
                    {item.isFolder && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shrink-0">
                        مجلد ({item.itemsCount} ملفات)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold">
                      {item.direction === 'send' ? (
                        <>
                          <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" />
                          <span>أُرسل إلى: {item.peerName}</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                          <span>استُقبل من: {item.peerName}</span>
                        </>
                      )}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{formatBytes(item.size)}</span>
                    <span>•</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                      {item.avgSpeedFormatted}
                    </span>
                    <span>•</span>
                    <span>{formatDateTime(item.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Checksum & Status */}
              <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                {/* SHA-256 Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">
                    SHA-256: {item.sha256.slice(0, 8)}...
                  </span>
                  <button
                    onClick={() => handleCopySha256(item.id, item.sha256)}
                    className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="نسخ التجزئة الكاملة"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اكتمل بنجاح</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
