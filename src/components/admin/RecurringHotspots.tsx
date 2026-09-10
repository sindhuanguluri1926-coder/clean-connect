import React from 'react';
import { RecurringHotspot } from '../../types/waste';
import { useLanguage } from '../../i18n/LanguageContext';
import { Flame, Lightbulb } from 'lucide-react';

interface RecurringHotspotsProps {
  hotspots: RecurringHotspot[];
}

export const RecurringHotspots: React.FC<RecurringHotspotsProps> = ({ hotspots }) => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded uppercase tracking-wider">
                {isTelugu ? 'ప్రిడిక్టివ్ అనలిటిక్స్' : 'Predictive Analytics'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {isTelugu ? 'నగర మున్సిపల్ పర్యవేక్షణ' : 'Urban Local Body Intelligence'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              {isTelugu ? 'పునరావృత వ్యర్థాల హాట్‌స్పాట్లు' : 'RECURRING WASTE HOTSPOTS'}
            </h3>
          </div>
        </div>

        <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          {isTelugu ? '30 రోజుల డేటా విశ్లేషణ' : '30-Day Recurrence Window'}
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed -mt-2">
        {isTelugu
          ? 'తరచూ చెత్త పేరుకుపోయే ప్రాంతాలను గుర్తించి, మూల కారణాలను విశ్లేషించి, మున్సిపల్ అధికారులకు దీర్ఘకాలిక పరిష్కార సూచనలను అందిస్తుంది.'
          : 'Identifies recurring garbage accumulation zones, isolates systemic commercial disposal bottlenecks, and provides actionable infrastructure recommendations.'}
      </p>

      {/* Hotspots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {hotspots.map(spot => (
          <div
            key={spot.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {spot.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    spot.recurrenceLevel === 'CRITICAL'
                      ? 'bg-rose-600 text-white'
                      : spot.recurrenceLevel === 'HIGH'
                      ? 'bg-amber-600 text-white'
                      : 'bg-yellow-500 text-slate-950'
                  }`}
                >
                  {spot.recurrenceLevel} {isTelugu ? 'తీవ్రత' : 'Recurrence'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                {isTelugu ? spot.titleTe : spot.title}
              </h4>
              <div className="text-xs text-slate-500 mb-4">
                {spot.locationName} ({spot.ward})
              </div>

              {/* Metric Counters */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {isTelugu ? '30-రోజుల నివేదికలు' : '30-Day Reports'}
                  </span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {spot.reportsCount30Days}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      {isTelugu ? 'సార్లు' : 'incidents'}
                    </span>
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {isTelugu ? 'ప్రధాన వ్యర్థం' : 'Primary Stream'}
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate block mt-1">
                    {isTelugu ? spot.primaryWasteTe : spot.primaryWaste}
                  </span>
                </div>
              </div>

              {/* Root Cause */}
              <div className="mb-2 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  {isTelugu ? 'గుర్తించిన మూల కారణం:' : 'Identified Root Cause:'}
                </span>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed text-[11px]">
                  {isTelugu ? spot.rootCauseTe : spot.rootCause}
                </p>
              </div>
            </div>

            {/* Recommended Municipal Action */}
            <div className="pt-3 border-t border-slate-200 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold mb-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider">
                  {isTelugu ? 'మున్సిపల్ కార్యాచరణ సిఫార్సు:' : 'Recommended Municipal Intervention:'}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/80 leading-normal">
                "{isTelugu ? spot.recommendedActionTe : spot.recommendedAction}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
