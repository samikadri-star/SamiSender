import React, { useState } from 'react';
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
  Copy,
  Check,
  Edit3
} from 'lucide-react';
import { DevicePeer, AppSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface ReceiveScreenProps {
  nearbyDevices: DevicePeer[];
  settings: AppSettings;
  onOpenEditUser: () => void;
}

export const ReceiveScreen: React.FC<ReceiveScreenProps> = ({
  nearbyDevices,
  settings,
  onOpenEditUser,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pairingCode] = useState('777-484');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* PWA Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Top Banner */}
      <div className="rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>رادار استقبال الملفات الحقيقي قيد الاستماع</span>
              </div>

              {/* User indicator & quick change button */}
              <button
                onClick={onOpenEditUser}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 hover:bg-emerald-500/50 text-white text-xs font-bold border border-emerald-400/30 backdrop-blur-xs cursor-pointer transition-colors"
                title="تعديل اسمك المعروض في الرادار"
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                  style={{ backgroundColor: settings.userAvatarColor || '#4F46E5' }}
                >
                  {(settings.userName || 'س').slice(0, 1)}
                </div>
                <span>المستلم: {settings.userName || 'سامي القادري'}</span>
                <Edit3 className="w-3 h-3 text-emerald-200" />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              شاشة استقبال الملفات والمجلدات
            </h2>
            <p className="mt-2 text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              جهازك الآن قابل للاكتشاف التلقائي عبر شبكة الواي فاي. عند قيام أي جهاز بإرسال ملفات أو مجلد إليك، ستظهر نافذة فورية لتأكيد الاستقبال وحفظ البيانات مع فحص SHA-256.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-xs text-emerald-200 font-bold block mb-1">حالة الاستماع للشبكة:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>جاهز لاستقبال البيانات الحقيقية</span>
              </span>
            </div>
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
              <div className="absolute inset-0 rounded-full border border-emerald-500/20 dark:border-emerald-400/20" />
              <div className="absolute inset-8 rounded-full border border-emerald-500/25 dark:border-emerald-400/25" />
              <div className="absolute inset-16 rounded-full border border-emerald-500/30 dark:border-emerald-400/30" />
              <div className="absolute inset-24 rounded-full border border-emerald-500/40 dark:border-emerald-400/40" />

              {isScanning && (
                <>
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-radar-1 pointer-events-none" />
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-radar-2 pointer-events-none" />
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-radar-3 pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center animate-sweep pointer-events-none">
                    <div className="w-1/2 h-0.5 bg-linear-to-r from-transparent to-emerald-500 shadow-sm shadow-emerald-500/50 origin-right" />
                  </div>
                </>
              )}

              {/* Center device icon with user avatar */}
              <div
                className="relative z-10 w-16 h-16 rounded-3xl text-white flex items-center justify-center shadow-lg text-xl font-black ring-4 ring-white dark:ring-slate-900"
                style={{ backgroundColor: settings.userAvatarColor || '#059669' }}
                title={settings.userName || 'أنت (المستلم)'}
              >
                {(settings.userName || 'س').slice(0, 1)}
              </div>

              {/* Real discovered nearby peer nodes plotted in radar */}
              {nearbyDevices.map((dev, i) => {
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
              {nearbyDevices.length > 0 ? (
                <>تم العثور على <span className="text-emerald-600 dark:text-emerald-400 font-bold">{nearbyDevices.length} أجهزة حقيقية</span> متصلة بالشبكة</>
              ) : (
                <>الرادار نشط وبانتظار ظهور أي جهاز مرسل عبر شبكة الواي فاي</>
              )}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              منفذ الاستماع المباشر: {settings.port} • بث وجود الجهاز عبر Wi-Fi Broadcast
            </p>
          </div>

          {/* List of nearby discovered devices */}
          {nearbyDevices.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3">
                الأجهزة النشطة في الشبكة
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Host Info, QR Code & Pairing */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-sm"
                  style={{ backgroundColor: settings.userAvatarColor || '#059669' }}
                >
                  {(settings.userName || 'س').slice(0, 1)}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    هذا الجهاز (المستلم)
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {settings.userName || 'سامي القادري'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {settings.deviceName}
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenEditUser}
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="تعديل اسم المستخدم والجهاز"
              >
                <Edit3 className="w-4 h-4" />
              </button>
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

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                رمز الاقتران المباشر
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              يمكن للجهاز المرسل إدخال هذا الرمز للاقتران المباشر:
            </p>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-widest">
                {pairingCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="نسخ الرمز"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 text-right">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>فحص تطابق البيانات SHA-256 يتم تلقائياً لكل ملف مستلم لضمان اكتماله 100%.</span>
            </div>
          </div>

          <div className="rounded-2xl p-3.5 bg-emerald-50/60 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-800 text-center">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              تطوير: سامي القادري 777484160
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
