import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  WasteReport,
  RecurringHotspot,
  WardMetric
} from '../types/waste';
import {
  INITIAL_MOCK_REPORTS,
  MOCK_RECURRING_HOTSPOTS,
  MOCK_WARD_METRICS
} from '../data/mockReports';

interface WasteContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  reports: WasteReport[];
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  selectedReport: WasteReport | undefined;
  hotspots: RecurringHotspot[];
  wardMetrics: WardMetric[];
  addNewReport: (report: WasteReport) => void;
  updateReportStatus: (id: string, updates: Partial<WasteReport>) => void;
  resetDemoData: () => void;
  stats: {
    totalReports: number;
    criticalReports: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
    pendingTasks: number;
    inProgressTasks: number;
    verifiedTasks: number;
    needsReviewTasks: number;
    activeWorkersCount: number;
  };
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'swachh_ai_reports_v3';

export const WasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('landing');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const [reports, setReports] = useState<WasteReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load reports from localStorage', e);
    }
    return INITIAL_MOCK_REPORTS;
  });

  const [hotspots] = useState<RecurringHotspot[]>(MOCK_RECURRING_HOTSPOTS);
  const [wardMetrics] = useState<WardMetric[]>(MOCK_WARD_METRICS);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports to localStorage', e);
    }
  }, [reports]);

  const addNewReport = (newReport: WasteReport) => {
    setReports(prev => [newReport, ...prev]);
    setSelectedReportId(newReport.id);
  };

  const updateReportStatus = (id: string, updates: Partial<WasteReport>) => {
    setReports(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const resetDemoData = () => {
    setReports(INITIAL_MOCK_REPORTS);
    setSelectedReportId(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];

  // Realistic municipal statistics
  const totalReports = reports.length + 338;
  const criticalReports = reports.filter(r => r.aiAnalysis.priority === 'CRITICAL').length + 16;
  const highPriority = reports.filter(r => r.aiAnalysis.priority === 'HIGH').length + 61;
  const mediumPriority = reports.filter(r => r.aiAnalysis.priority === 'MEDIUM').length + 119;
  const lowPriority = reports.filter(r => r.aiAnalysis.priority === 'LOW').length + 138;

  const pendingTasks = reports.filter(r => r.status === 'Assigned').length + 42;
  const inProgressTasks = reports.filter(r => r.status === 'In Progress' || r.status === 'Collected').length + 28;
  const verifiedTasks = reports.filter(r => r.status === 'Verified' || r.status === 'Completed').length + 275;
  const needsReviewTasks = reports.filter(r => r.status === 'Needs Review').length + 4;
  const activeWorkersCount = 28;

  return (
    <WasteContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        reports,
        selectedReportId,
        setSelectedReportId,
        selectedReport,
        hotspots,
        wardMetrics,
        addNewReport,
        updateReportStatus,
        resetDemoData,
        stats: {
          totalReports,
          criticalReports,
          highPriority,
          mediumPriority,
          lowPriority,
          pendingTasks,
          inProgressTasks,
          verifiedTasks,
          needsReviewTasks,
          activeWorkersCount,
        }
      }}
    >
      {children}
    </WasteContext.Provider>
  );
};

export const useWaste = () => {
  const context = useContext(WasteContext);
  if (!context) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
};
