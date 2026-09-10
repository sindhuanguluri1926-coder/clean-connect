import React, { useState } from 'react';
import { WasteReport } from '../../types/waste';
import { useWaste } from '../../context/WasteContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { verifyCleanedArea } from '../../services/aiWasteEngine';
import { CameraCapture } from '../camera/CameraCapture';
import { SimpleAIResultCard } from '../ai/SimpleAIResultCard';
import { BeforeAfterView } from '../verification/BeforeAfterView';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  HardHat,
  Play,
  CheckCircle2,
  Camera,
  RefreshCw,
  Sparkles,
  ClipboardList,
  AlertTriangle
} from 'lucide-react';

interface WorkerTaskDetailProps {
  report: WasteReport;
  onBack: () => void;
}

export const WorkerTaskDetail: React.FC<WorkerTaskDetailProps> = ({ report, onBack }) => {
  const { updateReportStatus } = useWaste();
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (report.status === 'Verified') return 7;
    if (report.status === 'Needs Review') return 6;
    if (report.status === 'Collected') return 5;
    if (report.status === 'In Progress') return 2;
    return 1;
  });

  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(report.afterImageUrl || null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [forceFailTest, setForceFailTest] = useState<boolean>(false);

  // Workflow Handlers
  const handleStartTask = () => {
    updateReportStatus(report.id, { status: 'In Progress' });
    setCurrentStep(2);
  };

  const handleMarkCollected = () => {
    updateReportStatus(report.id, { status: 'Collected' });
    setCurrentStep(4);
  };

  const handleAfterPhotoCaptured = (photoDataUrl: string) => {
    setAfterPhoto(photoDataUrl);
    setIsCameraOpen(false);
    setCurrentStep(6);
  };

  const handleRunVerification = async () => {
    if (!afterPhoto) return;

    setIsVerifying(true);
    try {
      const result = await verifyCleanedArea(report.imageUrl, afterPhoto, forceFailTest);
      updateReportStatus(report.id, {
        afterImageUrl: afterPhoto,
        verification: result,
        status: result.isVerified ? 'Verified' : 'Needs Review'
      });
      setCurrentStep(7);
      setIsVerifying(false);
    } catch (e) {
      console.error(e);
      setIsVerifying(false);
    }
  };

  const handleReopenTask = () => {
    updateReportStatus(report.id, { status: 'In Progress' });
    setAfterPhoto(null);
    setCurrentStep(2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Collected':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Needs Review':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button & Task ID Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btnBackToWorkerList')}</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(report.status)}`}>
            {t('taskStatusLabel')}: {report.status}
          </span>
          <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
            {report.id}
          </span>
        </div>
      </div>

      {/* Task Location & Navigation Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              {report.location.ward} • {report.location.zone}
            </span>
            <span className="text-xs text-slate-400">
              • {t('timestamp')} {report.reportedAt}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {report.location.name}
          </h2>
          {report.location.landmark && (
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{report.location.landmark}</span>
            </p>
          )}
        </div>

        {/* GPS Navigation Button */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${report.location.latitude},${report.location.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-colors self-start md:self-auto"
        >
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>{t('step2Navigate')}</span>
        </a>
      </div>

      {/* Worker Ordered Workflow Execution Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('workerWorkflowTitle')}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {t('assignedTo')}: <strong className="text-white">{report.assignedWorker?.name}</strong>
          </span>
        </div>

        {/* Step Buttons Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Start Task */}
          <button
            type="button"
            onClick={handleStartTask}
            disabled={report.status === 'In Progress' || report.status === 'Collected' || report.status === 'Verified'}
            className={`flex items-center justify-center space-x-2 p-3 rounded-xl text-xs font-bold transition-all ${
              report.status === 'In Progress' || report.status === 'Collected' || report.status === 'Verified'
                ? 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{t('step1Start')}</span>
          </button>

          {/* 2. Mark Collected */}
          <button
            type="button"
            onClick={handleMarkCollected}
            disabled={report.status === 'Collected' || report.status === 'Verified'}
            className={`flex items-center justify-center space-x-2 p-3 rounded-xl text-xs font-bold transition-all ${
              report.status === 'Collected' || report.status === 'Verified'
                ? 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('step3Collect')}</span>
          </button>

          {/* 3. Capture After Photo (Live Camera) */}
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            disabled={report.status === 'Verified'}
            className={`flex items-center justify-center space-x-2 p-3 rounded-xl text-xs font-bold transition-all ${
              report.status === 'Verified'
                ? 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-300" />
            <span>{afterPhoto ? `✓ ${t('step6CaptureAfter')}` : t('step6CaptureAfter')}</span>
          </button>

          {/* 4. AI Verify Cleanup */}
          <button
            type="button"
            onClick={handleRunVerification}
            disabled={!afterPhoto || isVerifying || report.status === 'Verified'}
            className={`flex items-center justify-center space-x-2 p-3 rounded-xl text-xs font-bold transition-all ${
              !afterPhoto || report.status === 'Verified'
                ? 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow'
            }`}
          >
            {isVerifying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-purple-300" />
            )}
            <span>{isVerifying ? 'Verifying...' : t('step7SubmitVerify')}</span>
          </button>
        </div>

        {/* Test simulation option for evaluation */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={forceFailTest}
              onChange={(e) => setForceFailTest(e.target.checked)}
              className="rounded text-rose-500 focus:ring-0"
            />
            <span className="text-[11px]">
              {isTelugu
                ? 'పరీక్ష: "అసంపూర్ణ శుభ్రత" అనుకరణ (సమీక్ష అవసరం టెస్ట్)'
                : 'Test: Simulate "Insufficient Cleanup" (Triggers Needs Review outcome)'}
            </span>
          </label>
        </div>
      </div>

      {/* Worker Camera Modal / Viewfinder */}
      {isCameraOpen && (
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-emerald-500/40 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>{t('workerCameraTitle')}</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCameraOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              {t('close')}
            </button>
          </div>

          <CameraCapture
            onPhotoSelected={handleAfterPhotoCaptured}
            mode="worker"
            title={t('workerCameraTitle')}
            subtitle={t('workerCameraDesc')}
          />
        </div>
      )}

      {/* Before / After Resolution Comparison */}
      {report.verification && (
        <BeforeAfterView report={report} onReopenTask={handleReopenTask} />
      )}

      {/* Clean AI Waste Understanding & Action Plan */}
      <SimpleAIResultCard analysis={report.aiAnalysis} />

      {/* Original Citizen Photo & Location Reference */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t('beforePhotoTitle')}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <img
            src={report.imageUrl}
            alt="Original waste site"
            className="sm:col-span-5 w-full h-48 object-cover rounded-xl border border-slate-200"
          />
          <div className="sm:col-span-7 space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-900 text-sm">{report.location.name}</div>
            <div className="text-slate-500 font-mono">
              GPS: {report.location.latitude}° N, {report.location.longitude}° E
            </div>
            <p className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
              <strong>{t('taskActionLabel')}:</strong>{' '}
              {isTelugu ? report.aiAnalysis.summaryActionTe : report.aiAnalysis.summaryAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
