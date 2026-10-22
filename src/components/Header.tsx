import React from 'react';
import {
  Wifi,
  Sun,
  Moon,
  Phone,
  Send,
  Download,
  History,
  Settings,
  Code,
  Info,
  User,
  Volume2,
  VolumeX,
  Edit3
} from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  activeTab: 'send' | 'receive' | 'history' | 'settings' | 'kotlin';
  setActiveTab: (tab: 'send' | 'receive' | 'history' | 'settings' | 'kotlin') => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onOpenAbout: () => void;
  onOpenEditUser: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  setSettings,
  onOpenAbout,
  onOpenEditUser,
}) => {
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSound = () => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const tabs = [
    { id: 'send' as const, label: 'إرسال ملفات ومجلدات', icon: Send },
    { id: 'receive' as const, label: 'استقبال وبحث تلقائي', icon: Download },
    { id: 'history' as const, label: 'سجل النقل', icon: History },
    { id: 'settings' as const, label: 'الإعدادات ومسار الحفظ', icon: Settings },
    { id: 'kotlin' as const, label: 'بناء APK وكود كوتلن', icon: Code, badge: 'APK' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & App title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Wifi className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  واي فاي شير برو
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  Wi-Fi 6 فائقة
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                نقل الملفات والمجلدات بدون إنترنت مع فحص SHA-256
              </p>
            </div>
          </div>

          {/* User Profile Badge & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Name & Avatar Button (Requirement 3: Ability to change username) */}
            <button
              onClick={onOpenEditUser}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs group"
              title="تغيير اسم المستخدم واسم الجهاز"
            >
              <div
                className="w-6 h-6 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-xs shrink-0"
                style={{ backgroundColor: settings.userAvatarColor || '#4F46E5' }}
              >
                {(settings.userName || 'سامي').slice(0, 1)}
              </div>
              <span className="max-w-[110px] sm:max-w-[150px] truncate">
                {settings.userName || 'سامي القادري'}
              </span>
              <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>

            {/* Sound toggle button */}
            <button
              onClick={toggleSound}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={settings.soundEnabled ? 'كتم صوت التنبيه' : 'تشغيل صوت التنبيه'}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={settings.theme === 'dark' ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي'}
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Developer pill / About button */}
            <button
              onClick={onOpenAbout}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-all text-xs font-semibold cursor-pointer shadow-xs"
              title="معلومات المطور"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-500" />
              <span>تطوير: سامي القادري 777484160</span>
            </button>

            <button
              onClick={onOpenAbout}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
              title="حول التطبيق والمطور"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile developer note */}
        <div className="lg:hidden pb-2 pt-0.5 flex justify-center">
          <button
            onClick={onOpenAbout}
            className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3 h-3" />
            <span>تطوير: سامي القادري 777484160</span>
          </button>
        </div>

        {/* Navigation Tabs (Material 3 Tabs) */}
        <nav className="flex space-x-2 space-x-reverse overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
