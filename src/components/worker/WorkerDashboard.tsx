import React, { useState } from 'react';
import { useWaste } from '../../context/WasteContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { WorkerTaskDetail } from './WorkerTaskDetail';
import {
  HardHat,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Truck,
  AlertTriangle,
  Split,
  Sparkles
} from 'lucide-react';
import { PriorityLevel } from '../../types/waste';

type TabType = 'active' | 'priority' | 'today' | 'completed';

export const WorkerDashboard: React.FC = () => {
  const { reports, selectedReportId, setSelectedReportId } = useWaste();
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  const [activeTab, setActiveTab] = useState<TabType>('active');

  const selectedReport = reports.find(r => r.id === selectedReportId);

  // If a task is selected, show its full detail execution view
  if (selectedReport) {
    return (
      <WorkerTaskDetail
        report={selectedReport}
        onBack={() => setSelectedReportId(null)}
      />
    );
  }

  // Filter logic
  const filteredReports = reports.filter(report => {
    if (activeTab === 'active') {
      return report.status === 'Assigned' || report.status === 'In Progress' || report.status === 'Collected' || report.status === 'Needs Review';
    }
    if (activeTab === 'priority') {
      return (report.aiAnalysis.priority === 'CRITICAL' || report.aiAnalysis.priority === 'HIGH') && report.status !== 'Verified';
    }
    if (activeTab === 'today') {
      return true;
    }
    if (activeTab === 'completed') {
      return report.status === 'Verified' || report.status === 'Completed';
    }
    return true;
  });

  const activeCount = reports.filter(
    r => r.status === 'Assigned' || r.status === 'In Progress' || r.status === 'Collected' || r.status === 'Needs Review'
  ).length;
  const highPriorityCount = reports.filter(
    r => (r.aiAnalysis.priority === 'CRITICAL' || r.aiAnalysis.priority === 'HIGH') && r.status !== 'Verified'
  ).length;
  const completedCount = reports.filter(r => r.status === 'Verified' || r.status === 'Completed').length;

  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'LOW':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Needs Review':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Collected':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Worker Header Hub */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  {t('workerPortalTitle')}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-mono">WRK-704</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {isTelugu ? 'రమేష్ కుమార్ (ఫీల్డ్ లీడ్)' : 'Ramesh Kumar (Lead Field Specialist)'}
              </h1>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center">
                  <Truck className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {isTelugu ? 'ఎలక్ట్రిక్ కాంపాక్టర్ కార్ట్ #08' : 'E-Compactor Cart #08'}
                </span>
                <span>•</span>
                <span>Ward 12 &amp; 18</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 flex items-center space-x-3 self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px]">{t('taskStatusLabel')}</span>
              <span className="font-bold text-emerald-400">{t('workerDutyStatus')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto space-x-2 pb-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
            activeTab === 'active'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{t('tabActiveTasks')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'active' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {activeCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('priority')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
            activeTab === 'priority'
              ? 'bg-amber-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{t('tabHighPriority')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'priority' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {highPriorityCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
            activeTab === 'today'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{t('tabTodayTasks')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'today' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {reports.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
            activeTab === 'completed'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{t('tabCompletedTasks')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'completed' ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {completedCount}
          </span>
        </button>
      </div>

      {/* Task Cards Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {isTelugu ? 'ఈ వర్గంలో పనులు లేవు' : 'No tasks in this category'}
          </h3>
          <p className="text-xs text-slate-500">
            {isTelugu
              ? 'ఈ వర్గానికి సరిపోలే అన్ని పనులు పరిష్కరించబడ్డాయి.'
              : 'All reports matching this criteria are completed or filtered.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map(report => {
            const detectedStr = report.aiAnalysis.detectedWaste
              .map(w => (isTelugu ? w.nameTe : w.name))
              .join(' + ');

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Task Details Header */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      TASK #{report.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border ${getPriorityStyle(
                        report.aiAnalysis.priority
                      )}`}
                    >
                      {isTelugu ? report.aiAnalysis.priorityTe : report.aiAnalysis.priority}{' '}
                      {t('priorityTitle')}
                    </span>
                  </div>

                  {/* Thumbnail & Location */}
                  <div className="flex items-start space-x-3">
                    <img
                      src={report.imageUrl}
                      alt="Waste preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center text-xs font-bold text-slate-900 truncate">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1 flex-shrink-0" />
                        <span className="truncate">{report.location.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {report.location.ward} • {report.location.zone}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{report.reportedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Waste & Status */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        {t('taskWasteLabel')}:
                      </span>
                      <span className="font-bold text-slate-800 truncate block">
                        {detectedStr}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        <strong>{t('segregationStatusTitle')}:</strong>{' '}
                        {isTelugu
                          ? report.aiAnalysis.segregationStatusTe
                          : report.aiAnalysis.segregationStatus}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70 text-[11px] text-slate-700">
                      <strong>{t('taskActionLabel')}:</strong>{' '}
                      {isTelugu
                        ? report.aiAnalysis.summaryActionTe
                        : report.aiAnalysis.summaryAction}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                      report.status
                    )}`}
                  >
                    {t('taskStatusLabel')}: {report.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedReportId(report.id)}
                    className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
                  >
                    <span>{t('btnViewTask')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
