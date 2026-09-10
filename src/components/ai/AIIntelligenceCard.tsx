import React from 'react';
import { SimplifiedAIAnalysis } from '../../types/waste';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sparkles, Split } from 'lucide-react';

interface AIIntelligenceCardProps {
  analysis: SimplifiedAIAnalysis;
}

export const AIIntelligenceCard: React.FC<AIIntelligenceCardProps> = ({ analysis }) => {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{t('detectedWasteTitle')}</h3>
            <p className="text-xs text-slate-500">{t('segregationStatusTitle')}</p>
          </div>
        </div>

        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
          <Split className="w-3 h-3" />
          <span>{isTelugu ? analysis.segregationStatusTe : analysis.segregationStatus}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {analysis.detectedWaste.map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center space-x-1.5 bg-slate-50 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <span>{item.emoji}</span>
            <span>{isTelugu ? item.nameTe : item.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
