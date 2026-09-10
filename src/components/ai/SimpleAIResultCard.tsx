import React from 'react';
import { SimplifiedAIAnalysis } from '../../types/waste';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Sparkles,
  Split,
  AlertTriangle,
  ClipboardList,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Layers,
  Apple,
  FileText,
  Wrench,
  Cpu
} from 'lucide-react';

interface SimpleAIResultCardProps {
  analysis: SimplifiedAIAnalysis;
}

export const SimpleAIResultCard: React.FC<SimpleAIResultCardProps> = ({ analysis }) => {
  const { language, t } = useLanguage();

  const isTelugu = language === 'te';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'organic':
        return <Apple className="w-4 h-4 text-emerald-600" />;
      case 'plastic':
        return <Layers className="w-4 h-4 text-blue-600" />;
      case 'paper':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'glass_metal':
        return <Wrench className="w-4 h-4 text-slate-600" />;
      case 'ewaste_hazardous':
        return <Cpu className="w-4 h-4 text-rose-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-500" />;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-600 text-white',
          border: 'border-rose-300',
          bg: 'bg-rose-50',
          icon: <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
        };
      case 'HIGH':
        return {
          badge: 'bg-amber-600 text-white',
          border: 'border-amber-300',
          bg: 'bg-amber-50',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />
        };
      case 'MEDIUM':
        return {
          badge: 'bg-blue-600 text-white',
          border: 'border-blue-300',
          bg: 'bg-blue-50',
          icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />
        };
      case 'LOW':
      default:
        return {
          badge: 'bg-emerald-600 text-white',
          border: 'border-emerald-300',
          bg: 'bg-emerald-50',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />
        };
    }
  };

  const priorityStyle = getPriorityStyle(analysis.priority);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              SWACHH-AI Vision
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              {t('aiAnalysisTitle')}
            </h3>
          </div>
        </div>

        {/* Priority Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 uppercase">{t('priorityTitle')}:</span>
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${priorityStyle.badge}`}>
            <span>{isTelugu ? analysis.priorityTe : analysis.priority}</span>
          </span>
        </div>
      </div>

      {/* Grid: Detected Waste & Segregation Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detected Waste Box */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('detectedWasteTitle')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.detectedWaste.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
              >
                <span>{item.emoji}</span>
                <span>{isTelugu ? item.nameTe : item.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Segregation Status Box */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('segregationStatusTitle')}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <Split className="w-4 h-4" />
            </span>
            <div>
              <div className="text-sm font-black text-slate-900 tracking-wide">
                {isTelugu ? analysis.segregationStatusTe : analysis.segregationStatus}
              </div>
              <p className="text-[11px] text-slate-500">
                {isTelugu
                  ? 'వ్యర్థాలు వేర్వేరు బిన్లలో వేయడానికి వర్గీకరించబడాలి.'
                  : 'Requires segregated sorting at municipal collection point.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Condition Description */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t('conditionTitle')}
        </h4>
        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
          "{isTelugu ? analysis.conditionTe : analysis.condition}"
        </p>
      </div>

      {/* Recommended Segregation Mapping (Item → Target Bin) */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>{t('recommendedSegregationTitle')}</span>
          <span className="text-[11px] text-emerald-700 font-medium lowercase">
            {isTelugu ? 'డస్ట్-బిన్ రూటింగ్' : 'bin routing sequence'}
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {analysis.recommendedSegregation.map((seg, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between gap-2"
            >
              <div className="text-xs font-bold text-slate-800 truncate">
                {isTelugu ? seg.itemTe : seg.item}
              </div>
              <div className="flex items-center space-x-1.5 flex-shrink-0 text-xs font-semibold">
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  seg.binColor === 'green'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : seg.binColor === 'blue'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : seg.binColor === 'yellow'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : seg.binColor === 'red'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}>
                  {isTelugu ? seg.targetBinTe : seg.targetBin}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Worker Action Plan Sequence */}
      <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('workerActionTitle')}
            </h4>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            {t('workerActionSubtitle')}
          </span>
        </div>

        <ol className="space-y-2 text-xs text-slate-300">
          {(isTelugu ? analysis.workerActionTe : analysis.workerAction).map((action, idx) => (
            <li key={idx} className="flex items-start space-x-2 leading-relaxed">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 border border-emerald-500/40">
                {idx + 1}
              </span>
              <span>{action.replace(/^\d+\.\s*/, '')}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
