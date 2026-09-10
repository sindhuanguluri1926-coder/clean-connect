import React from 'react';
import { useWaste } from '../../context/WasteContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { UserRole } from '../../types/waste';
import {
  ShieldCheck,
  HardHat,
  Building2,
  Home,
  UserCheck,
  RotateCcw,
  Languages
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, reports, resetDemoData } = useWaste();
  const { language, setLanguage, t } = useLanguage();

  const activeWorkerTasks = reports.filter(
    r => r.status === 'Assigned' || r.status === 'In Progress' || r.status === 'Needs Review'
  ).length;
  const criticalTasks = reports.filter(
    r => r.aiAnalysis.priority === 'CRITICAL' && r.status !== 'Verified'
  ).length;

  const roleNavItems: { role: UserRole; label: string; icon: React.ReactNode; badge?: number }[] = [
    { role: 'landing', label: t('navOverview'), icon: <Home className="w-4 h-4" /> },
    { role: 'citizen', label: t('navCitizen'), icon: <UserCheck className="w-4 h-4" /> },
    { role: 'worker', label: t('navWorker'), icon: <HardHat className="w-4 h-4" />, badge: activeWorkerTasks },
    { role: 'admin', label: t('navAdmin'), icon: <Building2 className="w-4 h-4" />, badge: criticalTasks > 0 ? criticalTasks : undefined }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Civic National Header Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1 text-xs flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          {/* Language Selector: English | తెలుగు */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('te')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'te'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              తెలుగు
            </button>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentRole('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  {t('brandName')}<span className="text-emerald-600">-AI</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide border border-emerald-200 uppercase">
                  SIH 26195
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none">
                {t('brandTagline')}
              </p>
            </div>
          </div>

          {/* Role Navigation Bar */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
            {roleNavItems.map(item => {
              const isActive = currentRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setCurrentRole(item.role)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-600' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        item.role === 'admin'
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Active Role Indicator */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">
                {t('activeRole')}
              </span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {currentRole === 'landing' && t('roleLanding')}
                {currentRole === 'citizen' && t('roleCitizen')}
                {currentRole === 'worker' && t('roleWorker')}
                {currentRole === 'admin' && t('roleAdmin')}
              </span>
            </div>
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                currentRole === 'citizen'
                  ? 'bg-blue-500 ring-4 ring-blue-100'
                  : currentRole === 'worker'
                  ? 'bg-amber-500 ring-4 ring-amber-100'
                  : currentRole === 'admin'
                  ? 'bg-purple-600 ring-4 ring-purple-100'
                  : 'bg-emerald-500 ring-4 ring-emerald-100'
              }`}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
