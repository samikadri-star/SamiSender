import React from 'react';
import {
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  Wifi,
  ShieldCheck,
  FolderTree,
  Zap,
  Moon,
  Smartphone
} from 'lucide-react';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    { title: 'نقل المجلدات بالكامل بضغطة زر واحدة', desc: 'الحفاظ التام على هيكلية المجلدات الفرعية والملفات الداخلية.' },
    { title: 'سرعة فائقة تصل إلى 100 MB/s', desc: 'استخدام مقابس TCP المحسنة وبافر 4MB عبر شبكات Wi-Fi 6.' },
    { title: 'التحقق الدقيق من سلامة البيانات (SHA-256)', desc: 'مطابقة التجزئة المشفرة للطرفين لضمان عدم تلف أي بايت.' },
    { title: 'رادار كشف الأجهزة القريبة التلقائي', desc: 'اكتشاف الهواتف وأجهزة الكمبيوتر القريبة فوراً دون إعدادات معقدة.' },
    { title: 'تصميم متجاوب يعتمد على Material Design 3', desc: 'تجربة مستخدم ناعمة، بطاقات تفاعلية ودعم أصيل للوضع الليلي.' },
    { title: 'مستودع كود أندرويد كوتلن كامل', desc: 'أكواد MainActivity وخدمات النقل وواجهات XML جاهزة للتحميل.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
                الإصدار 1.0.0 المستقر
              </span>
              <h3 className="text-xl font-bold leading-tight">
                واي فاي شير برو | WiFi Share Pro
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Developer Card (Mandatory Requirement) */}
          <div className="p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-center space-y-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-600 text-white inline-block">
              تطوير وبرمجة
            </span>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              سامي القادري
            </h4>
            <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono tracking-widest">
              777484160
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              تطوير تطبيقات الأندرويد الاحترافية بلغة Kotlin وأنظمة النقل الشبكي عالي الأداء والواجهات المتجاوبة.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href="tel:777484160"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>اتصال: 777484160</span>
              </a>
              <a
                href="https://wa.me/96777484160"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة واتساب</span>
              </a>
            </div>
          </div>

          {/* Key Specs Breakdown */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">
              المواصفات التقنية للتطبيق:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <h6 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {feat.title}
                    </h6>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
