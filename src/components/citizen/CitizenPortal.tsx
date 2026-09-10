import React, { useState } from 'react';
import { useWaste } from '../../context/WasteContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { analyzeWasteImage, generateReportId } from '../../services/aiWasteEngine';
import { CameraCapture } from '../camera/CameraCapture';
import { VoiceAssistantModal } from '../voice/VoiceAssistantModal';
import { SimpleAIResultCard } from '../ai/SimpleAIResultCard';
import {
  Camera,
  Mic,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Send,
  Navigation,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Truck
} from 'lucide-react';
import { WasteReport } from '../../types/waste';

export const CitizenPortal: React.FC = () => {
  const { addNewReport, setCurrentRole, setSelectedReportId } = useWaste();
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  // Core Reporting State: Photo + Location
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [ward, setWard] = useState<string>('Ward 12');
  const [zone, setZone] = useState<string>('Central Zone');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationDetected, setLocationDetected] = useState<boolean>(false);

  // Modals
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // Submission Flow Phases: 'idle' | 'checklist' | 'analyzing' | 'done'
  const [submissionPhase, setSubmissionPhase] = useState<'idle' | 'checklist' | 'analyzing' | 'done'>('idle');
  const [submittedReport, setSubmittedReport] = useState<WasteReport | null>(null);

  // Handle Photo selection from Camera Modal
  const handlePhotoCaptured = (photoDataUrl: string) => {
    setCapturedPhoto(photoDataUrl);
    setIsCameraModalOpen(false);

    // If location is not yet detected, trigger auto-location
    if (!locationDetected) {
      handleDetectLocation();
    }
  };

  // Browser Geolocation
  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          setLatitude(lat);
          setLongitude(lng);
          setLocationName(
            isTelugu
              ? `ప్రస్తుత GPS ప్రాంతం, వార్డు 12 (${lat}° N, ${lng}° E)`
              : `Current GPS Location, Ward 12 (${lat}° N, ${lng}° E)`
          );
          setWard('Ward 12');
          setZone('Central Zone');
          setIsLocating(false);
          setLocationDetected(true);
        },
        () => {
          // Fallback if denied or on desktop
          setLatitude(28.6315);
          setLongitude(77.2167);
          setLocationName(
            isTelugu
              ? `కన్నాట్ ప్లేస్ / మార్కెట్ రోడ్, వార్డు 12`
              : `Market Road / Central Axis, Ward 12`
          );
          setWard('Ward 12');
          setZone('Central Zone');
          setIsLocating(false);
          setLocationDetected(true);
        },
        { timeout: 6000 }
      );
    } else {
      setLatitude(28.6315);
      setLongitude(77.2167);
      setLocationName('Central Axis, Ward 12');
      setIsLocating(false);
      setLocationDetected(true);
    }
  };

  // Unified Submit Report Function (called by either the Submit button or Voice Assistant)
  const handleSubmitReport = async () => {
    if (!capturedPhoto) {
      setIsCameraModalOpen(true);
      return;
    }

    setIsVoiceModalOpen(false);
    setSubmissionPhase('checklist');

    try {
      // Step 1: Checklist animation (700ms)
      await new Promise(r => setTimeout(r, 700));

      // Step 2: Analyzing animation (1200ms)
      setSubmissionPhase('analyzing');
      const aiResult = await analyzeWasteImage(capturedPhoto, locationName);

      const newId = generateReportId();
      const report: WasteReport = {
        id: newId,
        imageUrl: capturedPhoto,
        location: {
          name: locationName || 'Market Road, Ward 12',
          ward: ward || 'Ward 12',
          zone: zone || 'Central Zone',
          latitude: latitude || 28.6315,
          longitude: longitude || 77.2167,
          landmark: 'Nearby Civic Landmark'
        },
        reportedAt: isTelugu ? 'ఇప్పుడే' : 'Just now',
        status: 'Assigned',
        language: language,
        assignedWorker: {
          id: 'WRK-704',
          name: isTelugu ? 'రమేష్ కుమార్' : 'Ramesh Kumar',
          badge: isTelugu ? 'సీనియర్ పారిశుద్ధ్య లీడ్' : 'Senior Sanitation Lead',
          phone: '+91 98765 43210',
          vehicle: isTelugu ? 'ఎలక్ట్రిక్ కాంపాక్టర్ కార్ట్ #08' : 'Electric Compactor Cart #08'
        },
        aiAnalysis: aiResult
      };

      addNewReport(report);
      setSubmittedReport(report);
      setSubmissionPhase('done');
    } catch (err) {
      console.error(err);
      setSubmissionPhase('idle');
    }
  };

  // Reset reporting flow to file another report
  const handleFileAnother = () => {
    setCapturedPhoto(null);
    setLocationDetected(false);
    setLocationName('');
    setLatitude(null);
    setLongitude(null);
    setSubmittedReport(null);
    setSubmissionPhase('idle');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* 1. CLEAN PRE-SUBMISSION REPORTING INTERFACE */}
      {submissionPhase === 'idle' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
              {t('brandName')}-AI
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('reportWasteTitle')}
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t('citizenSubheading')}
            </p>
          </div>

          {/* 3 Main Action Cards */}
          <div className="space-y-3">
            {/* Action 1: Open Camera */}
            <button
              type="button"
              onClick={() => setIsCameraModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-emerald-500/30 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {t('btnOpenCameraAction')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {capturedPhoto ? t('statusPhotoCaptured') : t('cameraSubtitle')}
                  </p>
                </div>
              </div>

              {capturedPhoto ? (
                <div className="flex items-center space-x-2">
                  <img
                    src={capturedPhoto}
                    alt="Thumbnail"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                  />
                  <Check className="w-4 h-4 text-emerald-600 font-bold" />
                </div>
              ) : (
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              )}
            </button>

            {/* Action 2: Voice Assistant */}
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {t('btnVoiceAssistantAction')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isTelugu ? 'వాయిస్ ద్వారా రిపోర్ట్ చేయండి' : 'Hands-free voice-guided reporting'}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-200">
                {isTelugu ? 'తెలుగు / EN' : 'EN / తెలుగు'}
              </div>
            </button>

            {/* Action 3: Detect Location */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                  <MapPin className={`w-6 h-6 ${isLocating ? 'animate-bounce text-emerald-600' : ''}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {t('btnDetectLocationAction')}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs">
                    {locationDetected ? locationName : t('locationAddressPlaceholder')}
                  </p>
                </div>
              </div>

              {locationDetected ? (
                <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <Navigation className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              )}
            </button>
          </div>

          {/* Status Indicators Strip */}
          <div className="bg-slate-100/80 rounded-2xl p-3.5 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            {/* Photo Status */}
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${capturedPhoto ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  {t('statusPhotoLabel')}
                </span>
                <span className="font-bold text-slate-800 text-[11px]">
                  {capturedPhoto ? t('statusPhotoCaptured') : t('statusPhotoNotCaptured')}
                </span>
              </div>
            </div>

            {/* Location Status */}
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${locationDetected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  {t('statusLocationLabel')}
                </span>
                <span className="font-bold text-slate-800 text-[11px]">
                  {locationDetected ? t('statusLocationDetected') : t('statusLocationNotDetected')}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Submit Report Button */}
          <button
            type="button"
            onClick={handleSubmitReport}
            disabled={!capturedPhoto}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="w-5 h-5" />
            <span>{t('btnSubmitReport')}</span>
          </button>

          <p className="text-[11px] text-center text-slate-400 leading-relaxed">
            {t('citizenFooterNote')}
          </p>
        </div>
      )}

      {/* 2. POST-SUBMISSION STEP 1: REPORT SUBMITTED CHECKLIST */}
      {submissionPhase === 'checklist' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-bold shadow-md shadow-emerald-600/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t('postSubmitReportSubmitted')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isTelugu ? 'మీ నివేదిక సిస్టమ్‌కు విజయవంతంగా అందింది' : 'Telemetry successfully transmitted to SWACHH-AI'}
            </p>
          </div>

          {/* Checklist */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-left max-w-xs mx-auto text-xs">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{t('checkPhotoReceived')}</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{t('checkLocationReceived')}</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>{t('checkAiStarted')}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. POST-SUBMISSION STEP 2: ANALYZING WASTE... */}
      {submissionPhase === 'analyzing' && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <div className="w-full h-full flex items-center justify-center text-emerald-400">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              {t('analyzingTitle')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('analyzingSubtitle')}
            </p>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full w-4/5 animate-pulse" />
          </div>
        </div>
      )}

      {/* 4. POST-SUBMISSION STEP 3: CLEAN AI WASTE ANALYSIS & WORKER TASK CREATED */}
      {submissionPhase === 'done' && submittedReport && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Worker Task Created Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  {t('workerTaskCreatedTitle')}
                </span>
                <h3 className="text-base font-black text-white">
                  {t('aiReportId')}: <span className="text-emerald-400 font-mono">{submittedReport.id}</span>
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              {isTelugu
                ? `పారిశుద్ధ్య కార్మికుడు ${submittedReport.assignedWorker?.name} కు కేటాయించబడింది (${submittedReport.location.name}).`
                : `Assigned to ${submittedReport.assignedWorker?.name} (${submittedReport.location.name}).`}
            </p>

            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedReportId(submittedReport.id);
                  setCurrentRole('worker');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>{t('btnOpenInWorker')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleFileAnother}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                {t('btnFileAnother')}
              </button>
            </div>
          </div>

          {/* Clean AI Result Card */}
          <SimpleAIResultCard analysis={submittedReport.aiAnalysis} />

          {/* Photo & GPS Reference */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3">
            <img
              src={submittedReport.imageUrl}
              alt="Reported site"
              className="w-20 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="min-w-0 text-xs text-slate-600 space-y-0.5">
              <div className="font-bold text-slate-900 truncate">
                {submittedReport.location.name}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {submittedReport.location.latitude}° N, {submittedReport.location.longitude}° E
              </div>
              <div className="text-[10px] text-slate-400">
                {submittedReport.reportedAt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAMERA MODAL OVERLAY */}
      {isCameraModalOpen && (
        <CameraCapture
          onPhotoSelected={handlePhotoCaptured}
          onClose={() => setIsCameraModalOpen(false)}
          currentImage={capturedPhoto}
          mode="citizen"
        />
      )}

      {/* VOICE ASSISTANT MODAL OVERLAY */}
      {isVoiceModalOpen && (
        <VoiceAssistantModal
          onPhotoCaptured={handlePhotoCaptured}
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          hasPhoto={!!capturedPhoto}
          hasLocation={locationDetected}
          photoUrl={capturedPhoto}
          locationName={locationName}
          onTriggerCamera={() => {
            setIsVoiceModalOpen(false);
            setIsCameraModalOpen(true);
          }}
          onTriggerDetectLocation={handleDetectLocation}
          onSubmitReport={handleSubmitReport}
          isSubmitting={submissionPhase === 'analyzing'}
        />
      )}
    </div>
  );
};
