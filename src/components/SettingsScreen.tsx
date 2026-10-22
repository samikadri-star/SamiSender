import React, { useState } from 'react';
import {
  Settings,
  FolderCog,
  Volume2,
  Bell,
  Smartphone,
  Wifi,
  Moon,
  Sun,
  ShieldCheck,
  Check,
  Save,
  Phone,
  MessageCircle,
  Cpu,
  RotateCcw
} from 'lucide-react';
import { AppSettings } from '../types';
import { soundManager } from '../utils/audio';
import { requestNotificationPermission, showSystemNotification, triggerVibration } from '../utils/notifications';
import { DEFAULT_SETTINGS } from '../utils/storage';

interface SettingsScreenProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onSaveToast: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  setSettings,
  onSaveToast,
}) => {
  const [savePath, setSavePath] = useState(settings.savePath);
  const [deviceName, setDeviceName] = useState(settings.deviceName);
  const [port, setPort] = useState(settings.port);
  const [chunkSize, setChunkSize] = useState(settings.chunkSizeKB);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [vibrateEnabled, setVibrateEnabled] = useState(settings.vibrateEnabled);
  const [autoCategorize, setAutoCategorize] = useState(settings.autoCategorizeByType);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick preset paths for Android storage
  const presetPaths = [
    { label: 'مجلد التنزيلات (Downloads)', path: '/storage/emulated/0/Download/WiFiShare_Sami/' },
    { label: 'بطاقة الذاكرة الخارجية (SD Card)', path: '/storage/sdcard1/WiFiShare_Sami/' },
    { label: 'مجلد المستندات (Documents)', path: '/storage/emulated/0/Documents/WiFiShare_Sami/' },
    { label: 'مجلد وسائط المعرض (DCIM)', path: '/storage/emulated/0/DCIM/WiFiShare_Sami/' },
  ];

  const handleSave = () => {
    setSettings((prev) => ({
      ...prev,
      savePath,
      deviceName,
      port: Number(port) || 8888,
      chunkSizeKB: chunkSize,
      soundEnabled,
      notificationsEnabled,
      vibrateEnabled,
      autoCategorizeByType: autoCategorize,
    }));
    setSavedSuccess(true);
    onSaveToast();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const testAudioChime = () => {
    soundManager.playSuccess();
    if (vibrateEnabled) triggerVibration([100, 50, 100]);
  };

  const testSystemNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      showSystemNotification('واي فاي شير برو - تنبيه تجريبي', {
        body: 'تم اختبار نظام الإشعارات بنجاح. تطوير: سامي القادري 777484160',
      });
    }
  };

  const handleResetDefaults = () => {
    setSavePath(DEFAULT_SETTINGS.savePath);
    setDeviceName(DEFAULT_SETTINGS.deviceName);
    setPort(DEFAULT_SETTINGS.port);
    setChunkSize(DEFAULT_SETTINGS.chunkSizeKB);
    setSoundEnabled(DEFAULT_SETTINGS.soundEnabled);
    setNotificationsEnabled(DEFAULT_SETTINGS.notificationsEnabled);
    setVibrateEnabled(DEFAULT_SETTINGS.vibrateEnabled);
    setAutoCategorize(DEFAULT_SETTINGS.autoCategorizeByType);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold">إعدادات التطبيق ومسار الحفظ</h2>
          </div>
          <p className="text-slate-300 text-sm">
            تخصيص مسار حفظ الملفات، بافر النقل، التنبيهات الصوتية، والوضع الليلي.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة الافتراضي</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <div className="space-y-6">
        {/* Section 1: Custom Save Path */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FolderCog className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                مسار الحفظ الافتراضي للملفات المستقبلة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                حدد المسار داخل ذاكرة الهاتف أو وحدة التخزين لحفظ الملفات والمجلدات
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              المسار المخصص:
            </label>
            <input
              type="text"
              value={savePath}
              onChange={(e) => setSavePath(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dir-ltr text-left"
              placeholder="/storage/emulated/0/Download/WiFiShare_Sami/"
            />

            {/* Quick Presets */}
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                مسارات جاهزة سريعة:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {presetPaths.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => setSavePath(preset.path)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors cursor-pointer ${
                      savePath === preset.path
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Categorize Toggle */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  فرز الملفات تلقائياً في مجلدات فرعية (Videos, Images, Documents)
                </span>
                <p className="text-[11px] text-slate-500">
                  ينشئ مجلدات فرعية حسب نوع الملف عند الاستقبال
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoCategorize}
                onChange={(e) => setAutoCategorize(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Notifications & Sound Chime */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                إشعارات التنبيه والأصوات
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تفعيل الإشعارات وتنبيهات الصوت اللحظية عند اكتمال العمليات
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3 pt-1">
            {/* Sound Chime Toggle & Test */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  تشغيل صوت التنبيه (Web Audio Harmonic Chime)
                </span>
                <p className="text-[11px] text-slate-500">
                  يعزف نغمة كريستالية لطيفة عند اكتمال النقل والتحقق من التجزئة
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={testAudioChime}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>تجربة الصوت</span>
                </button>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* System Notifications Toggle & Test */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  إشعارات سطح المكتب والنظام (Push Notifications)
                </span>
                <p className="text-[11px] text-slate-500">
                  إظهار إشعار النظام حتى لو كان المتصفح أو التطبيق في الخلفية
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={testSystemNotification}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>اختبار إشعار</span>
                </button>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  اهتزاز الهاتف عند انتهاء النقل
                </span>
                <p className="text-[11px] text-slate-500">
                  نبضة اهتزاز تأكيدية عند نجاح فحص SHA-256
                </p>
              </div>
              <input
                type="checkbox"
                checked={vibrateEnabled}
                onChange={(e) => setVibrateEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Performance & Wi-Fi Buffer */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                أداء قنوات الواي فاي والبافر
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ضبط حجم قوالب البيانات لزيادة سرعة النقل الحقيقية (MB/s)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                حجم البافر المقسم (Socket Chunk Size):
              </label>
              <select
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={256}>256 KB (مناسب للشبكات المزدحمة)</option>
                <option value={512}>512 KB (متوازن)</option>
                <option value={1024}>1024 KB / 1 MB (موصى به لشبكات 5GHz)</option>
                <option value={4096}>4096 KB / 4 MB (أقصى سرعة Wi-Fi 6)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                اسم هذا الجهاز المعروض للآخرين:
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Developer Signature & Contact Card */}
        <div className="rounded-3xl bg-linear-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-right">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-indigo-200">
                معلومات المطور
              </span>
              <h3 className="text-xl font-black">
                تطوير: سامي القادري
              </h3>
              <p className="text-indigo-200 text-sm font-mono tracking-wider font-bold">
                هاتف / واتساب: 777484160 (+967 777 484 160)
              </p>
              <p className="text-xs text-slate-300 max-w-md">
                مهندس برمجيات متخصص في تطوير تطبيقات الأندرويد الاحترافية بلغة Kotlin وأنظمة النقل الشبكي فائق السرعة.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:777484160"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>اتصال مباشر</span>
              </a>
              <a
                href="https://wa.me/96777484160"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-5 h-5 text-emerald-300" />
                <span>تم حفظ التعديلات بنجاح!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ التعديلات والإعدادات</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
