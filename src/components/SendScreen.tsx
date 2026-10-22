import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FolderUp,
  FilePlus,
  Trash2,
  HardDrive,
  FolderTree,
  Wifi,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  Film,
  Music,
  Image as ImageIcon,
  Archive,
  Code,
  Edit3,
  Radio,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { DevicePeer, FileItem, AppSettings } from '../types';
import { formatBytes, getFileCategory } from '../utils/formatters';
import { PWAInstallButton } from './PWAInstallButton';

interface SendScreenProps {
  nearbyDevices: DevicePeer[];
  selectedDevice: DevicePeer | null;
  setSelectedDevice: (device: DevicePeer | null) => void;
  onStartTransfer: (items: FileItem[], targetDevice: DevicePeer, isFolder: boolean, folderName?: string) => void;
  settings: AppSettings;
  onOpenEditUser: () => void;
}

export const SendScreen: React.FC<SendScreenProps> = ({
  nearbyDevices,
  selectedDevice,
  setSelectedDevice,
  onStartTransfer,
  settings,
  onOpenEditUser,
}) => {
  const [selectedItems, setSelectedItems] = useState<FileItem[]>([]);
  const [isFolderMode, setIsFolderMode] = useState(false);
  const [folderName, setFolderName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (filename: string) => {
    const cat = getFileCategory(filename);
    switch (cat) {
      case 'video': return <Film className="w-5 h-5 text-rose-500" />;
      case 'audio': return <Music className="w-5 h-5 text-amber-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case 'archive': return <Archive className="w-5 h-5 text-purple-500" />;
      case 'code': return <Code className="w-5 h-5 text-blue-500" />;
      default: return <FileText className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleFilesChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    const newItems: FileItem[] = files.map((file, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      file: file,
      progress: 0,
      status: 'pending',
    }));

    setSelectedItems((prev) => [...prev, ...newItems]);
    setIsFolderMode(false);
    setErrorMsg(null);
  };

  const handleFolderChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    const firstRel = (files[0] as unknown as { webkitRelativePath?: string }).webkitRelativePath || '';
    const rootName = firstRel.split('/')[0] || 'مجلد مخصص';

    const newItems: FileItem[] = files.map((file, idx) => {
      const relPath = (file as unknown as { webkitRelativePath?: string }).webkitRelativePath || file.name;
      return {
        id: `folder-file-${Date.now()}-${idx}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        relativePath: relPath,
        file: file,
        progress: 0,
        status: 'pending',
      };
    });

    setSelectedItems(newItems);
    setIsFolderMode(true);
    setFolderName(rootName);
    setErrorMsg(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const files = Array.from(e.dataTransfer.files);
    const newItems: FileItem[] = files.map((file, idx) => ({
      id: `dropped-${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      file: file,
      progress: 0,
      status: 'pending',
    }));

    setSelectedItems((prev) => [...prev, ...newItems]);
    setIsFolderMode(false);
  };

  const removeItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setSelectedItems([]);
    setIsFolderMode(false);
    setFolderName('');
  };

  const totalBytes = selectedItems.reduce((acc, item) => acc + item.size, 0);

  const handleStart = () => {
    if (selectedItems.length === 0) {
      setErrorMsg('يرجى اختيار ملفات أو مجلد حقيقي أولاً');
      return;
    }
    if (!selectedDevice) {
      setErrorMsg('يرجى اختيار الجهاز المستلم من قائمة الأجهزة المتصلة');
      return;
    }
    setErrorMsg(null);
    onStartTransfer(selectedItems, selectedDevice, isFolderMode, folderName);
  };

  return (
    <div className="space-y-6">
      {/* PWA Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Top Banner with Material 3 Elevation & User identity bar */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>نطاق 5 جيجاهرتز Wi-Fi 6 فائق السرعة</span>
              </div>

              {/* User indicator & quick change button */}
              <button
                onClick={onOpenEditUser}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 hover:bg-indigo-500/50 text-white text-xs font-bold border border-indigo-400/30 backdrop-blur-xs cursor-pointer transition-colors"
                title="تغيير اسمك وهويتك"
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                  style={{ backgroundColor: settings.userAvatarColor || '#4F46E5' }}
                >
                  {(settings.userName || 'س').slice(0, 1)}
                </div>
                <span>المرسل: {settings.userName || 'سامي القادري'}</span>
                <Edit3 className="w-3 h-3 text-indigo-200" />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              إرسال الملفات والمجلدات الحقيقية
            </h2>
            <p className="mt-2 text-indigo-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              اختر ملفاتك أو مجلداتك من جهازك وأرسلها مباشرة عبر شبكة الواي فاي إلى الجهاز المستلم بدون إنترنت مع التحقق الفوري من سلامة التجزئة SHA-256.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => folderInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
            >
              <FolderOpen className="w-4 h-4" />
              <span>إرسال مجلد بالكامل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload Area & Target Device */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: File & Folder Pickers */}
        <div className="lg:col-span-2 space-y-4">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFilesChosen}
            className="hidden"
          />
          <input
            type="file"
            ref={folderInputRef}
            // @ts-expect-error webkitdirectory is standard in browsers but not typed in react standard HTMLProps
            webkitdirectory=""
            directory=""
            onChange={handleFolderChosen}
            className="hidden"
          />

          {/* Dropzone Card */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 shadow-xs ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-400'
            }`}
          >
            <div className="mx-auto w-16 h-16 rounded-3xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              اسحب وأفلت الملفات أو المجلدات هنا
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              اختر ملفات من ذاكرة هاتفك أو حاسوبك (فيديوهات، صور، تطبيقات APK، مستندات) أو اختر مجلداً كاملاً لنقله بهيكليته الكاملة.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <FilePlus className="w-4 h-4" />
                <span>اختيار ملفات من الجهاز</span>
              </button>

              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <FolderUp className="w-4 h-4" />
                <span>اختيار مجلد بالكامل</span>
              </button>
            </div>
          </div>

          {/* Selected Items List & Folder Inspector */}
          {selectedItems.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  {isFolderMode ? (
                    <FolderTree className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <HardDrive className="w-5 h-5 text-indigo-500" />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {isFolderMode ? `مجلد: ${folderName}` : 'الملفات المختارة للإرسال'}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedItems.length} عنصر • الحجم الإجمالي: {formatBytes(totalBytes)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-bold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>تفريغ القائمة</span>
                </button>
              </div>

              {/* Items scroll */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto pr-1">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                        {getFileIcon(item.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {item.name}
                        </p>
                        {item.relativePath && item.relativePath !== item.name && (
                          <p className="text-[11px] text-slate-400 truncate dir-ltr text-right">
                            {item.relativePath}
                          </p>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatBytes(item.size)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Target Device Selection */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  الأجهزة المستلمة النشطة
                </h3>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                nearbyDevices.length > 0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {nearbyDevices.length} متصل
              </span>
            </div>

            {/* Devices list or Waiting state */}
            {nearbyDevices.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="relative mx-auto w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                  <Radio className="w-6 h-6 text-indigo-600 dark:text-indigo-400 relative z-10" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    بانتظار ظهور جهاز مستلم...
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    افتح التطبيق في جهازك الآخر (أو افتح تبويباً جديداً في المتصفح) على شاشة <strong>"استقبال"</strong> ليتم اكتشافه فوراً بالرادار!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {nearbyDevices.map((device) => {
                  const isSelected = selectedDevice?.id === device.id;
                  return (
                    <div
                      key={device.id}
                      onClick={() => setSelectedDevice(device)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs"
                          style={{ backgroundColor: device.avatarColor }}
                        >
                          {device.name.slice(0, 1)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {device.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {device.ipAddress}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              {device.frequency}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            {device.signalStrength}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {errorMsg && (
              <div className="mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Launch Transfer Button */}
            <button
              onClick={handleStart}
              disabled={selectedItems.length === 0}
              className={`mt-5 w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                selectedItems.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>
                {selectedItems.length > 0
                  ? `بدء الإرسال الحقيقي (${formatBytes(totalBytes)})`
                  : 'حدد الملفات أو المجلد أولاً'}
              </span>
            </button>
          </div>

          <div className="rounded-2xl p-3.5 bg-indigo-50/60 dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-800 text-center">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
              تطوير: سامي القادري 777484160
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
