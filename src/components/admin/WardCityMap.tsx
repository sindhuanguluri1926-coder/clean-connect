import React, { useState } from 'react';
import { WasteReport, PriorityLevel } from '../../types/waste';
import { useLanguage } from '../../i18n/LanguageContext';
import { MapPin, Eye } from 'lucide-react';

interface WardCityMapProps {
  reports: WasteReport[];
  onSelectReport: (id: string) => void;
}

export const WardCityMap: React.FC<WardCityMapProps> = ({ reports, onSelectReport }) => {
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  const [activeReport, setActiveReport] = useState<WasteReport | null>(reports[0] || null);

  const getMarkerBadgeClass = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500 text-white shadow-rose-500/50';
      case 'HIGH':
        return 'bg-amber-500 text-white shadow-amber-500/50';
      case 'MEDIUM':
        return 'bg-yellow-500 text-slate-950 shadow-yellow-500/50';
      case 'LOW':
      default:
        return 'bg-emerald-500 text-white shadow-emerald-500/50';
    }
  };

  const getMapPosition = (_lat: number, _lng: number, index: number) => {
    const xOffsets = [35, 68, 22, 78, 50, 42, 60];
    const yOffsets = [45, 65, 30, 40, 25, 75, 55];
    const left = xOffsets[index % xOffsets.length];
    const top = yOffsets[index % yOffsets.length];
    return { left: `${left}%`, top: `${top}%` };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Map Control Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isTelugu ? 'భౌగోళిక వ్యర్థాల మ్యాప్' : 'Geospatial Waste Telemetry'}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-0.5">
            {isTelugu ? 'ఇంటరాక్టివ్ వార్డు & హాట్‌స్పాట్ మ్యాప్' : 'Interactive City Ward & Hotspot Map'}
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-slate-400 font-bold uppercase text-[10px]">
            {t('priorityTitle')}:
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>{t('priorityCritical')}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{t('priorityHigh')}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span>{t('priorityMedium')}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{t('priorityLow')}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 relative min-h-[420px] overflow-hidden flex items-center justify-center p-4 select-none">
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M-50,220 Q250,180 500,280 T1050,240" fill="none" stroke="#0284c7" strokeWidth="6" opacity="0.4" />
            <path d="M200,-50 Q300,250 450,550" fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray="6,6" opacity="0.5" />
          </svg>

          <div className="absolute top-4 left-4 text-xs font-mono text-slate-500/80 pointer-events-none">
            GRID 28.6139° N / 77.2090° E
          </div>

          <div className="absolute top-12 left-16 text-[11px] font-bold text-slate-600 tracking-widest uppercase pointer-events-none border border-slate-800 px-2 py-1 rounded bg-slate-900/60">
            WARD 7 (North)
          </div>
          <div className="absolute bottom-28 left-20 text-[11px] font-bold text-slate-600 tracking-widest uppercase pointer-events-none border border-slate-800 px-2 py-1 rounded bg-slate-900/60">
            WARD 12 (Central)
          </div>
          <div className="absolute bottom-16 right-20 text-[11px] font-bold text-slate-600 tracking-widest uppercase pointer-events-none border border-slate-800 px-2 py-1 rounded bg-slate-900/60">
            WARD 18 (South)
          </div>

          {/* Interactive Report Pins */}
          {reports.map((report, idx) => {
            const pos = getMapPosition(report.location.latitude, report.location.longitude, idx);
            const isSelected = activeReport?.id === report.id;
            const priority = report.aiAnalysis.priority;

            return (
              <div
                key={report.id}
                style={{ left: pos.left, top: pos.top }}
                onClick={() => setActiveReport(report)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              >
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-transform transform ${
                    isSelected ? 'scale-125 ring-4 ring-white' : 'hover:scale-110'
                  } ${getMarkerBadgeClass(priority)}`}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </div>

                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap border border-slate-700 pointer-events-none">
                  {report.id} • {report.location.ward}
                </div>
              </div>
            );
          })}
        </div>

        {/* Marker Inspector Popover Sidebar (4 Cols) */}
        <div className="lg:col-span-4 p-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
          {activeReport ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {t('tableColId')}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">{activeReport.id}</h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  activeReport.aiAnalysis.priority === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : activeReport.aiAnalysis.priority === 'HIGH'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {isTelugu ? activeReport.aiAnalysis.priorityTe : activeReport.aiAnalysis.priority}
                </span>
              </div>

              <div className="space-y-2">
                <img
                  src={activeReport.imageUrl}
                  alt="Incident"
                  className="w-full h-32 object-cover rounded-xl border border-slate-200"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{activeReport.location.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {activeReport.location.ward} • {activeReport.location.zone}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {t('detectedWasteTitle')}
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeReport.aiAnalysis.detectedWaste.map(w => (
                    <span
                      key={w.category}
                      className="bg-white text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200"
                    >
                      {w.emoji} {isTelugu ? w.nameTe : w.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('taskStatusLabel')}:</span>
                  <span className="font-bold text-slate-800">{activeReport.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('tableColWorker')}:</span>
                  <span className="font-medium text-slate-700">{activeReport.assignedWorker?.name || 'Unassigned'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectReport(activeReport.id)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t('btnInspect')}</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-400">
              Click any pin on the map to inspect report details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
