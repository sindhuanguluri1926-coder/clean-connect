import React from 'react';
import { RecommendedSegregationItem } from '../../types/waste';
import { useLanguage } from '../../i18n/LanguageContext';
import { Split, ArrowRight, ClipboardList } from 'lucide-react';

interface SegregationPlanCardProps {
  recommendedSegregation: RecommendedSegregationItem[];
  workerAction: string[];
}

export const SegregationPlanCard: React.FC<SegregationPlanCardProps> = ({
  recommendedSegregation,
  workerAction
}) => {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <Split className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">{t('recommendedSegregationTitle')}</h3>
          <p className="text-xs text-slate-500">{t('workerActionSubtitle')}</p>
        </div>
      </div>

      {/* Recommended Segregation Mapping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {recommendedSegregation.map((seg, idx) => (
          <div
            key={idx}
            className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-2"
          >
            <span className="text-xs font-bold text-slate-800 truncate">
              {isTelugu ? seg.itemTe : seg.item}
            </span>
            <div className="flex items-center space-x-1.5 flex-shrink-0 text-xs font-semibold">
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="bg-white px-2 py-0.5 rounded text-[11px] font-bold text-slate-700 border border-slate-200">
                {isTelugu ? seg.targetBinTe : seg.targetBin}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Worker Action Sequence */}
      <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase pb-1 border-b border-slate-800">
          <ClipboardList className="w-4 h-4" />
          <span>{t('workerActionTitle')}</span>
        </div>
        <ol className="space-y-1.5 text-xs text-slate-300">
          {workerAction.map((act, i) => (
            <li key={i} className="flex items-start space-x-2">
              <span className="text-emerald-400 font-mono font-bold">•</span>
              <span>{act.replace(/^\d+\.\s*/, '')}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
