import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Radio,
  QrCode,
  ShieldCheck,
  RefreshCw,
  FolderDown,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';
import { DevicePeer, AppSettings, FileItem } from '../types';
import { generateSyntheticSHA256 } from '../utils/crypto';

interface ReceiveScreenProps {
  nearbyDevices: DevicePeer[];
  settings: AppSettings;
  onSimulateIncomingTransfer: (items: FileItem[], senderPeer: DevicePeer, isFolder: boolean, folderName?: string) => void;
}

export const ReceiveScreen: React.FC<ReceiveScreenProps> = ({
  nearbyDevices,
  settings,
  onSimulateIncomingTransfer,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pairingCode] = useState('777-484'); // Inspired by developer number 777484160!

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Simulate incoming folder transfer from nearby device
  const triggerSampleIncomingFolder = () => {
    const sender = nearbyDevices[0] || {
      id: 'dev-incoming',
      name: 'سامسونج S24 ألترا (المرسل)',
      deviceType: 'android',
      ipAddress: '192.168.1.120',
      port: 8888,
      signalStrength: 95,
      frequency: '5 GHz (Wi-Fi 6)',
      status: 'available',
      avatarColor: '#4F46E5',
    };

    const incomingFolderFiles: FileItem[] = [
      { id: 'inc-1', name: 'Kotlin_Wi-Fi_Direct_Guide.pdf', size: 18 * 1024 * 1024, type: 'application/pdf', relativePath: 'مجلد_المشروع_الكامل/Kotlin_Wi-Fi_Direct_Guide.pdf', progress: 0, status: 'pending' },
      { id: 'inc-2', name: 'SourceCode_WiFiSharePro.zip', size: 125 * 1024 * 1024, type: 'application/zip', relativePath: 'مجلد_المشروع_الكامل/SourceCode_WiFiSharePro.zip', progress: 0, status: 'pending' },
      { id: 'inc-3', name: 'Demo_Video_4K_100Mbps.mp4', size: 450 * 1024 * 1024, type: 'video/mp4', relativePath: 'مجلد_المشروع_الكامل/Media/Demo_Video_4K_100Mbps.mp4', progress: 0, status: 'pending' },
      { id: 'inc-4', name: 'App_Release_v1.0.apk', size: 32 * 1024 * 1024, type: 'application/vnd.android.package-archive', relativePath: 'مجلد_المشروع_الكامل/Builds/App_Release_v1.0.apk', progress: 0, status: 'pending' },
    ];

    onSimulateIncomingTransfer(incomingFolderFiles, sender, true, 'مجلد_المشروع_الكامل');
  };

  const triggerSampleIncomingFile = () => {
    const sender = nearbyDevices[1] || nearbyDevices[0];
    const incomingFile: FileItem[] = [
      {
        id: `inc-file-${Date.now()}`,
        name: 'أرشيف_الملفات_الضخمة_2026.iso',
        size: 980 * 1024 * 1024, // 980 MB
        type: 'application/x-iso-image',
        progress: 0,
        status: 'pending',
        sha256: generateSyntheticSHA256('archive-iso-2026'),
      },
    ];
    onSimulateIncomingTransfer(incomingFile, sender, false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium mb-3 backdrop-blur-xs">
              <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>البحث التلقائي عن الأجهزة القريبة قيد التشغيل</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              شاشة استقبال الملفات والمجلدات
            </h2>
            <p className="mt-2 text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              جهازك الآن قابل للاكتشاف عبر شبكة الواي فاي المحلية. يمكنك استقبال الملفات والمجلدات فوراً مع حفظها في المسار المخصص ومطابقة SHA-256.
            </p>
          </div>

          {/* Quick simulation buttons for immediate testing */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <span className="text-xs text-emerald-200 font-semibold mb-0.5">اختبار استقبال فوري:</span>
            <button
              onClick={triggerSampleIncomingFolder}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer border border-white/10"
            >
              <FolderDown className="w-4 h-4 text-emerald-300" />
              <span>تجربة استقبال مجلد كامل (625 MB)</span>
            </button>
            <button
              onClick={triggerSampleIncomingFile}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>تجربة استقبال ملف ضخم (980 MB)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Radar & Discovered Devices */}
        <div className="lg:col-span-2 space-y-6">
          {/* Radar Scanning Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs text-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  رادار كشف الأجهزة التلقائي
                </h3>
              </div>

              <button
                onClick={() => setIsScanning(!isScanning)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isScanning
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'جارٍ المسح المستمر' : 'متوقف مؤقتاً'}</span>
              </button>
            </div>

            {/* Visual Radar Container */}
            <div className="relative mx-auto my-8 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Radar concentric rings */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/20 dark:border-emerald-400/20" />
              <div className="absolute inset-8 rounded-full border border-emerald-500/25 dark:border-emerald-400/25" />
              <div className="absolute inset-16 rounded-full border border-emerald-500/30 dark:border-emerald-400/30" />
              <div className="absolute inset-24 rounded-full border border-emerald-500/40 dark:border-emerald-400/40" />

              {/* Pulsing radar waves */}
              {isScanning && (
                <>
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-radar-1 pointer-events-none" />
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-radar-2 pointer-events-none" />
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-radar-3 pointer-events-none" />
                  {/* Rotating sweep line */}
                  <div className="absolute inset-0 flex items-center justify-center animate-sweep pointer-events-none">
                    <div className="w-1/2 h-0.5 bg-linear-to-r from-transparent to-emerald-500 shadow-sm shadow-emerald-500/50 origin-right" />
                  </div>
                </>
              )}

              {/* Center device icon */}
              <div className="relative z-10 w-16 h-16 rounded-3xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Smartphone className="w-8 h-8" />
              </div>

              {/* Discovered nearby peer nodes plotted in radar */}
              {nearbyDevices.map((dev, i) => {
                // Pre-calculated orbital positions
                const angles = [45, 140, 230, 310];
                const distances = [90, 80, 100, 75];
                const angle = angles[i % angles.length] * (Math.PI / 180);
                const dist = distances[i % distances.length];
                const x = Math.cos(angle) * dist;
                const y = Math.sin(angle) * dist;

                return (
                  <div
                    key={dev.id}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className="absolute z-20 group cursor-pointer"
                    title={`${dev.name} (${dev.signalStrength}%)`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white dark:ring-slate-900 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: dev.avatarColor }}
                    >
                      {dev.name.slice(0, 1)}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              تم اكتشاف <span className="text-emerald-600 dark:text-emerald-400 font-bold">{nearbyDevices.length} أجهزة</span> نشطة في نطاق الواي فاي
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              البروتوكول المستخدم: TCP High-Speed NIO Socket عبر المنفذ {settings.port}
            </p>
          </div>

          {/* List of nearby discovered devices */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3">
              الأجهزة المتاحة للإرسال والاستقبال
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nearbyDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: dev.avatarColor }}
                    >
                      {dev.name.slice(0, 1)}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {dev.name}
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {dev.ipAddress}
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {dev.frequency}
                      </span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {dev.signalStrength}%
                    </span>
                    <div className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${dev.signalStrength}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Host Info, QR Code & Pairing */}
        <div className="space-y-6">
          {/* Host info card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  هذا الجهاز (المستلم)
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {settings.deviceName}
                </h3>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">عنوان IP المحلي:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">192.168.1.108</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">منفذ الاستماع (Port):</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{settings.port}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">نطاق التردد:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">5 GHz Wi-Fi 6</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">مسار حفظ الملفات:</span>
                <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-[150px] dir-ltr text-left">
                  {settings.savePath}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Pairing Code & QR */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                رمز الاقتران السريع
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              يمكن للجهاز المرسل إدخال هذا الرمز للاقتران المباشر:
            </p>

            {/* Visual Pairing Code */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-widest">
                {pairingCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                title="نسخ الرمز"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Security integrity note */}
            <div className="mt-5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 text-right">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>فحص تطابق البيانات SHA-256 يتم تلقائياً قبل حفظ أي ملف لضمان خلوه من أي عيوب أو أخطاء.</span>
            </div>
          </div>

          {/* Developer signature */}
          <div className="rounded-2xl p-3.5 bg-emerald-50/60 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-800 text-center">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              تطوير: سامي القادري 777484160
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
