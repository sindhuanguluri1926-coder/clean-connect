import React from 'react';
import { WasteProvider, useWaste } from './context/WasteContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { MunicipalDashboard } from './components/admin/MunicipalDashboard';

const AppContent: React.FC = () => {
  const { currentRole } = useWaste();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
      <Header />

      <main className="flex-1">
        {currentRole === 'landing' && <LandingPage />}
        {currentRole === 'citizen' && <CitizenPortal />}
        {currentRole === 'worker' && <WorkerDashboard />}
        {currentRole === 'admin' && <MunicipalDashboard />}
      </main>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <WasteProvider>
        <AppContent />
      </WasteProvider>
    </LanguageProvider>
  );
}

export default App;
