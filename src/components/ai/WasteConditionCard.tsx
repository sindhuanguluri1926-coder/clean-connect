import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Activity } from 'lucide-react';

interface WasteConditionCardProps {
  condition: string;
}

export const WasteConditionCard: React.FC<WasteConditionCardProps> = ({ condition }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2.5">
      <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{t('conditionTitle')}</h3>
          <p className="text-[11px] text-slate-500">Visible physical observation</p>
        </div>
      </div>

      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
        "{condition}"
      </p>
    </div>
  );
};
