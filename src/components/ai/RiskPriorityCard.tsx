import React from 'react';
import { PriorityLevel } from '../../types/waste';
import { useLanguage } from '../../i18n/LanguageContext';
import { AlertOctagon, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RiskPriorityCardProps {
  priority: PriorityLevel;
  condition: string;
}

export const RiskPriorityCard: React.FC<RiskPriorityCardProps> = ({ priority, condition }) => {
  const { t } = useLanguage();

  const getPriorityTheme = (p: PriorityLevel) => {
    switch (p) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-300',
          badge: 'bg-rose-600 text-white',
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 animate-pulse" />
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          badge: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
        };
      case 'MEDIUM':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          badge: 'bg-blue-600 text-white',
          icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-300',
          badge: 'bg-emerald-600 text-white',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
        };
    }
  };

  const theme = getPriorityTheme(priority);

  return (
    <div className={`rounded-2xl p-5 border ${theme.border} ${theme.bg} shadow-sm space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-200">
            {theme.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('priorityTitle')}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase inline-block mt-0.5 ${theme.badge}`}>
              {priority}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60 text-xs text-slate-700 font-medium">
        "{condition}"
      </div>
    </div>
  );
};
