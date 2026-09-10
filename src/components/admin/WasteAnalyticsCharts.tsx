import React from 'react';
import { WardMetric } from '../../types/waste';
import { useLanguage } from '../../i18n/LanguageContext';
import { PieChart, BarChart3, TrendingUp, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WasteAnalyticsChartsProps {
  wardMetrics: WardMetric[];
}

export const WasteAnalyticsCharts: React.FC<WasteAnalyticsChartsProps> = ({ wardMetrics }) => {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  // Realistic citywide category composition
  const wasteCategories = [
    { label: t('catOrganic'), percent: 42, color: '#10b981', stream: t('binWet') },
    { label: t('catPlastic'), percent: 30, color: '#3b82f6', stream: t('binDryRecyclable') },
    { label: t('catPaper'), percent: 14, color: '#f59e0b', stream: t('binPaper') },
    { label: t('catGlassMetal'), percent: 8, color: '#64748b', stream: t('binDryRecyclable') },
    { label: t('catEwaste'), percent: 4, color: '#8b5cf6', stream: t('binHazardous') },
    { label: t('catOther'), percent: 2, color: '#94a3b8', stream: t('binGeneral') },
  ];

  return (
    <div className="space-y-6">
      {/* Top 2 Analytics Columns: Category Distribution & Ward Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Common Waste Types (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isTelugu ? 'ప్రధాన వ్యర్థాల రకాలు' : 'Most Common Waste Types'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isTelugu ? 'నగరవ్యాప్త వర్గీకరణ' : 'Citywide Waste Composition Spectrum'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-3.5">
              {wasteCategories.map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{item.percent}%</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            {isTelugu
              ? 'ప్రధాన ప్రాధాన్యత: తడి సేంద్రీయ వ్యర్థాల కంపోస్టింగ్ & ప్లాస్టిక్ రీసైక్లింగ్'
              : 'Primary Focus: Wet waste composting & single-use polymer recycling.'}
          </div>
        </div>

        {/* Ward-Wise Reports & Compliance (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isTelugu ? 'వార్డు వారీ నివేదికలు & విభజన నాణ్యత' : 'Ward-Wise Reports & Compliance'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isTelugu ? 'సంఘటనల పరిమాణం vs ఫీల్డ్ వర్తింపు' : 'Incident Volume vs. Field Segregation Quality'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {wardMetrics.map(ward => (
                <div
                  key={ward.ward}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{ward.ward}: {ward.name}</span>
                      <span className="text-[10px] text-slate-400 block">{ward.zone}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {ward.totalReports} {isTelugu ? 'నివేదికలు' : 'reports'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold block">
                        {ward.segregationComplianceRate}% {isTelugu ? 'విభజన' : 'segregation rate'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full"
                      style={{ width: `${ward.segregationComplianceRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>{isTelugu ? 'అత్యధిక విభజన రేటు:' : 'Highest Compliance:'} <strong className="text-slate-800">Ward 7 (94%)</strong></span>
            <span>{isTelugu ? 'సగటు స్పందన:' : 'Avg Response:'} <strong className="text-slate-800">2.8 hrs</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
