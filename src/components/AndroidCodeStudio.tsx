import React, { useState } from 'react';
import {
  Code,
  FileCode,
  FolderArchive,
  Download,
  Copy,
  Check,
  Smartphone,
  Eye,
  Layers,
  Sparkles,
  Wifi,
  Send,
  Radio,
  FileText
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_KOTLIN_PROJECT } from '../data/androidKotlinProject';
import { KotlinCodeFile } from '../types';

export const AndroidCodeStudio: React.FC = () => {
  const [activeFile, setActiveFile] = useState<KotlinCodeFile>(ANDROID_KOTLIN_PROJECT[0]);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate and download full Android Studio project ZIP
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Readme instructions
      zip.file(
        'README.md',
        `# WiFi Share Pro - Android Kotlin & XML Project
تطبيق نقل الملفات والمجلدات عبر الواي فاي بسرعة فائقة
تطوير: سامي القادري 777484160

## المواصفات المضمنة:
1. شاشة إرسال الملفات والمجلدات مع اختيار المجلد بضغطة واحدة
2. شاشة استقبال الملفات مع خاصية البحث التلقائي عن الأجهزة عبر الواي فاي دايركت
3. شريط تقدم لحظي مع دقة النسبة المئوية
4. دعم نقل الملفات الضخمة والتحقق التلقائي من بصمة SHA-256
5. عرض سرعة النقل الحقيقية (MB/s)
6. واجهات XML مبنية على معايير Material Design 3
7. دعم الوضع الليلي (Dark Mode) وDayNight
8. خدمة خلفية Foreground Service مع تنبيهات صوتية واهتزاز

تطوير: سامي القادري 777484160
`
      );

      // Add each file in its proper Android Studio directory structure
      ANDROID_KOTLIN_PROJECT.forEach((f) => {
        zip.file(f.path, f.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'WiFiSharePro_Android_Kotlin_SamiAlQadiri.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('حدث خطأ أثناء تجميع ملفات المشروع');
    } finally {
      setIsZipping(false);
    }
  };

  const kotlinFiles = ANDROID_KOTLIN_PROJECT.filter((f) => f.type === 'kotlin');
  const xmlFiles = ANDROID_KOTLIN_PROJECT.filter((f) => f.type === 'xml');
  const otherFiles = ANDROID_KOTLIN_PROJECT.filter((f) => f.type !== 'kotlin' && f.type !== 'xml');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-linear-to-r from-violet-950 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-medium mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            <span>مشروع أندرويد ستوديو كامل جاهز للبناء (Ready for Android Studio)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            مستودع أكواد كوتلن (Kotlin) وواجهات (XML)
          </h2>
          <p className="mt-2 text-violet-100 text-sm max-w-2xl leading-relaxed">
            تمت هيكلة المشروع بأعلى معايير بنية برمجيات الأندرويد الحديثة: Wi-Fi Direct، قنوات NIO Socket عالية السرعة، حساب تجزئة SHA-256، واجهات Material Design 3 متجاوبة، والوضع الليلي.
            <br />
            <strong className="text-amber-300">تطوير: سامي القادري 777484160</strong>
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
        >
          <FolderArchive className="w-5 h-5" />
          <span>{isZipping ? 'جاري ضغط المشروع...' : 'تحميل مشروع أندرويد كاملاً (.ZIP)'}</span>
        </button>
      </div>

      {/* Switcher Tab: Code Viewer vs Visual Phone Mockup */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>محرر الأكواد وملفات المشروع</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>معاينة واجهات XML على شاشة الهاتف</span>
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
          {ANDROID_KOTLIN_PROJECT.length} ملفات مصدرية مدرجة
        </span>
      </div>

      {/* Code Viewer View */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: File Tree */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              شجرة ملفات المشروع (Project Tree)
            </h4>

            {/* Kotlin classes */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 px-2 flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5" />
                <span>ملفات كوتلن (Kotlin .kt)</span>
              </span>
              {kotlinFiles.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFile(f)}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    activeFile.name === f.name
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300">
                    kt
                  </span>
                </button>
              ))}
            </div>

            {/* XML Layouts */}
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>واجهات ماتيريال (XML Layouts)</span>
              </span>
              {xmlFiles.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFile(f)}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    activeFile.name === f.name
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300">
                    xml
                  </span>
                </button>
              ))}
            </div>

            {/* Config & Manifest */}
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 px-2 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>الإعدادات والمانيفيست</span>
              </span>
              {otherFiles.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFile(f)}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    activeFile.name === f.name
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300">
                    cfg
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right 3 Cols: Code Display */}
          <div className="lg:col-span-3 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden flex flex-col text-slate-100 font-mono">
            {/* Code Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {activeFile.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-sans">
                    {activeFile.description}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-sans transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>نسخ الكود</span>
                  </>
                )}
              </button>
            </div>

            {/* Path indicator */}
            <div className="px-4 py-1.5 bg-slate-900/50 border-b border-slate-800 text-[11px] text-indigo-400 dir-ltr text-left">
              {activeFile.path}
            </div>

            {/* Code Body */}
            <pre className="p-6 text-xs overflow-x-auto leading-relaxed text-indigo-100 scrollbar-thin dir-ltr text-left selection:bg-indigo-600">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Visual XML Phone Mockup View */}
      {activeTab === 'preview' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              محاكي واجهات Material Design 3 للأندرويد
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              معاينة بصرية لكيفية ترجمة ملفات XML إلى واجهات أندرويد حقيقية متوافقة مع الهواتف الذكية.
            </p>
          </div>

          {/* Interactive Phone Frame */}
          <div className="mx-auto w-full max-w-sm rounded-[44px] bg-slate-900 p-4 shadow-2xl border-4 border-slate-800 text-slate-900 relative">
            {/* Phone Notch / Dynamic Island */}
            <div className="w-32 h-5 bg-slate-950 rounded-b-2xl mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800" />
            </div>

            {/* Screen Content */}
            <div className="rounded-[32px] bg-slate-50 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-4 space-y-4 min-h-[580px] flex flex-col justify-between">
              {/* App Bar */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-sm">واي فاي شير برو</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    Wi-Fi 6
                  </span>
                </div>

                {/* Hero card inside phone */}
                <div className="mt-4 p-4 rounded-2xl bg-indigo-600 text-white shadow-md">
                  <span className="text-[11px] font-semibold text-indigo-200">
                    سرعة تصل إلى 100 MB/s
                  </span>
                  <h4 className="text-base font-bold mt-1">
                    نقل الملفات والمجلدات
                  </h4>
                  <p className="text-[11px] text-indigo-100 mt-0.5">
                    بدون استهلاك باقة الإنترنت مع تشفير SHA-256
                  </p>
                </div>

                {/* Cards Menu */}
                <div className="mt-4 space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-600 text-white">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs">إرسال ملفات ومجلدات</h5>
                      <span className="text-[10px] text-slate-500">مجلدات كاملة بضغطة زر</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs">استقبال الملفات</h5>
                      <span className="text-[10px] text-slate-500">رادار البحث التلقائي النشط</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer signature inside phone footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  تطوير: سامي القادري 777484160
                </span>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  Material Design 3 • Kotlin Coroutines
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
