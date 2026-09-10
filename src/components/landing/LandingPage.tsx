import React from 'react';
import { useWaste } from '../../context/WasteContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Camera,
  Cpu,
  Split,
  CheckCircle2,
  HardHat,
  Building2,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentRole, stats } = useWaste();
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            {t('heroTitle1')} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              {t('heroTitle2')}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-10">
            {t('heroDescription')}
          </p>

          {/* Quick Role CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => setCurrentRole('citizen')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Camera className="w-5 h-5" />
              <span>{t('btnReportWaste')}</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentRole('worker')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition-all transform hover:-translate-y-0.5"
            >
              <HardHat className="w-5 h-5 text-amber-400" />
              <span>{t('btnWorkerPortal')}</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentRole('admin')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition-all transform hover:-translate-y-0.5"
            >
              <Building2 className="w-5 h-5 text-purple-400" />
              <span>{t('btnAdminPortal')}</span>
            </button>
          </div>

          {/* Civic Metrics Ribbon */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-bold text-white font-mono">{stats.totalReports}</div>
              <div className="text-xs text-slate-400 mt-0.5">{t('metricsTotalReports')}</div>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-bold text-emerald-400 font-mono">275</div>
              <div className="text-xs text-slate-400 mt-0.5">{t('metricsVerifiedCleanups')}</div>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-bold text-teal-300 font-mono">28</div>
              <div className="text-xs text-slate-400 mt-0.5">{t('metricsActiveWorkers')}</div>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-bold text-amber-400 font-mono">2.8 hrs</div>
              <div className="text-xs text-slate-400 mt-0.5">{t('metricsAvgResponse')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Operational Pipeline Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-emerald-700 font-bold tracking-wider text-xs uppercase bg-emerald-100 px-3 py-1 rounded-full">
            {isTelugu ? 'సరళమైన క్లీనింగ్ వ్యవస్థ' : 'Clean Operational Philosophy'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-3">
            {isTelugu
              ? 'పౌరుడి నుండి కార్మికుడి వరకు: 4 దశల ప్రయాణం'
              : 'From Citizen Photo to Verified Cleanup'}
          </h2>
          <p className="text-slate-600 text-sm">
            {isTelugu
              ? 'సాంకేతిక జార్గన్ లేకుండా, పౌరుడు ఫోటో తీస్తాడు, AI అర్థం చేసుకుంటుంది, కార్మికుడు శుభ్రం చేస్తాడు, సిస్టమ్ ధృవీకరిస్తుంది.'
              : 'Zero technical burden on citizens. The AI understands the waste automatically, creates a segregation plan, and confirms completion.'}
          </p>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
              {t('landingPillar1Tag')}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {t('landingPillar1Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landingPillar1Desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-300 shadow-md ring-1 ring-emerald-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              {t('landingPillar2Tag')}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {t('landingPillar2Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landingPillar2Desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <HardHat className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
              {t('landingPillar3Tag')}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {t('landingPillar3Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landingPillar3Desc')}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
              {t('landingPillar4Tag')}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {t('landingPillar4Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landingPillar4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-center text-xs space-y-2">
        <div className="font-bold text-slate-200">
        </div>
        <div className="text-slate-500">
          Clean &amp; Green Technology • Smart Waste Segregation, Disposal &amp; Improved Sanitation System
        </div>
      </footer>
    </div>
  );
};
