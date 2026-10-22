import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Check,
  Sparkles,
  Palette,
  Shield
} from 'lucide-react';
import { AppSettings } from '../types';

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onSaveToast: (msg: string) => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  onSaveToast,
}) => {
  const [userName, setUserName] = useState(settings.userName || 'سامي القادري');
  const [deviceName, setDeviceName] = useState(settings.deviceName);
  const [avatarColor, setAvatarColor] = useState(settings.userAvatarColor || '#4F46E5');

  useEffect(() => {
    if (isOpen) {
      setUserName(settings.userName || 'سامي القادري');
      setDeviceName(settings.deviceName);
      setAvatarColor(settings.userAvatarColor || '#4F46E5');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const colorPresets = [
    { label: 'نيلي ملكي', hex: '#4F46E5' },
    { label: 'زمردي', hex: '#059669' },
    { label: 'بنفسجي', hex: '#7C3AED' },
    { label: 'ياقوتي', hex: '#E11D48' },
    { label: 'كهرماني', hex: '#D97706' },
    { label: 'سماوي بحري', hex: '#0284C7' },
  ];

  const devicePresets = [
    'هاتف سامسونج جالاكسي S24 ألترا',
    'شاومي 14 برو (صنعاء)',
    'هاتف ردمي نوت 13 برو+',
    'لابتوب ديل XPS 15 (سامي)',
    'ماك بوك إير M3 (المكتب)',
    'تابلت سامسونج Tab S9',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUserName = userName.trim() || 'مستخدم واي فاي';
    const finalDeviceName = deviceName.trim() || 'جهاز أندرويد';

    setSettings((prev) => ({
      ...prev,
      userName: finalUserName,
      deviceName: finalDeviceName,
      userAvatarColor: avatarColor,
    }));

    onSaveToast(`تم تحديث اسم المستخدم إلى "${finalUserName}" بنجاح!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-md"
              style={{ backgroundColor: avatarColor }}
            >
              {userName.slice(0, 1) || 'س'}
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
                الهوية عبر شبكة الواي فاي
              </span>
              <h3 className="text-xl font-bold leading-tight">
                تعديل اسم المستخدم والجهاز
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Live Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-md shrink-0 transition-transform hover:scale-105"
              style={{ backgroundColor: avatarColor }}
            >
              {userName.slice(0, 1) || 'س'}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                المعاينة كما يراها الآخرون في الرادار
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white truncate mt-1">
                {userName || 'اسم المستخدم'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {deviceName || 'اسم الجهاز'} • 192.168.1.108
              </p>
            </div>
          </div>

          {/* User Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-500" />
              <span>اسم المستخدم (اسمك الشخصي أو المستعار):</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="مثال: سامي القادري"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Device Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>اسم الجهاز (المعروض في قائمة الأجهزة القريبة):</span>
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="مثال: هاتف سامسونج جالاكسي S24 ألترا"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Presets */}
            <div className="pt-1 flex flex-wrap gap-1.5">
              {devicePresets.slice(0, 4).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDeviceName(preset)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Color Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>لون الشعار والرمز التعريفي:</span>
            </label>
            <div className="flex items-center gap-3 pt-1">
              {colorPresets.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setAvatarColor(color.hex)}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    avatarColor === color.hex
                      ? 'scale-115 ring-2 ring-offset-2 ring-indigo-500 shadow-md'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                >
                  {avatarColor === color.hex && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التغييرات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
