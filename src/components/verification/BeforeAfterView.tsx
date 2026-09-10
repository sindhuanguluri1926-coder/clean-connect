import React, { useState } from 'react';
import { WasteReport } from '../../types/waste';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  CheckCircle2,
  AlertOctagon,
  RotateCcw,
  SlidersHorizontal,
  Columns
} from 'lucide-react';

interface BeforeAfterViewProps {
  report: WasteReport;
  onReopenTask?: () => void;
}

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({ report, onReopenTask }) => {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const verification = report.verification;
  const beforeImg = report.imageUrl;
  const afterImg =
    report.afterImageUrl ||
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80';

  if (!verification) {
    return null;
  }

  const isVerified = verification.isVerified;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
              isVerified ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-rose-600 shadow-rose-600/20'
            }`}
          >
            {isVerified ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {t('verificationResultTitle')}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {report.id}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              {isVerified ? t('statusVerified') : t('statusNeedsReview')}
            </h3>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${
              viewMode === 'side-by-side' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{isTelugu ? 'పక్కపక్కన' : 'Dual View'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${
              viewMode === 'slider' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isTelugu ? 'స్లైడర్' : 'Slider'}</span>
          </button>
        </div>
      </div>

      {/* Visual Comparison Stage */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Before Photo */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {t('beforePhotoTitle')}
              </span>
              <span className="text-slate-400 text-[11px]">{report.reportedAt}</span>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
              <img src={beforeImg} alt="Before cleanup" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* After Photo */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {t('afterPhotoTitle')}
              </span>
              <span className="text-slate-400 text-[11px]">{verification.verifiedAt}</span>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
              <img src={afterImg} alt="After cleanup" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      ) : (
        /* Split Slider View */
        <div className="space-y-2">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 select-none">
            <img src={afterImg} alt="After cleanup" className="absolute inset-0 w-full h-full object-cover" />

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={beforeImg}
                alt="Before cleanup"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: '100%', maxWidth: 'none' }}
              />
              <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                BEFORE
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              AFTER
            </div>

            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center text-slate-800 text-xs font-bold">
                ↔
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
            />
          </div>
        </div>
      )}

      {/* Verification Feedback Banner */}
      <div
        className={`rounded-xl p-5 border ${
          isVerified ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
        } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                isVerified ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {isVerified ? t('statusVerified') : t('statusNeedsReview')}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {verification.verifiedAt}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            {isTelugu ? verification.feedbackTe : verification.feedback}
          </p>
        </div>

        {!isVerified && onReopenTask && (
          <button
            type="button"
            onClick={onReopenTask}
            className="flex-shrink-0 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('btnReopenTask')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
