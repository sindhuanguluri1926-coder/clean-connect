export type UserRole = 'landing' | 'citizen' | 'worker' | 'admin';

export type WasteCategoryType =
  | 'organic'
  | 'plastic'
  | 'paper'
  | 'glass_metal'
  | 'ewaste_hazardous'
  | 'other';

export interface DetectedWasteItem {
  category: WasteCategoryType;
  name: string; // e.g., "Plastic Bottles" / "ప్లాస్టిక్ సీసాలు"
  nameTe: string;
  iconName: string;
  emoji: string;
  binType: string;
  binTypeTe: string;
  binColor: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
}

export type SegregationStatus = 'MIXED WASTE' | 'SEGREGATED WASTE';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RecommendedSegregationItem {
  item: string;
  itemTe: string;
  targetBin: string;
  targetBinTe: string;
  binColor: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
}

export interface SimplifiedAIAnalysis {
  detectedWaste: DetectedWasteItem[];
  segregationStatus: SegregationStatus;
  segregationStatusTe: string;
  condition: string;
  conditionTe: string;
  priority: PriorityLevel;
  priorityTe: string;
  recommendedSegregation: RecommendedSegregationItem[];
  workerAction: string[];
  workerActionTe: string[];
  summaryAction: string;
  summaryActionTe: string;
}

export type VerificationStatus = 'VERIFIED' | 'NEEDS REVIEW';

export interface SimpleVerificationResult {
  status: VerificationStatus;
  statusTe: string;
  feedback: string;
  feedbackTe: string;
  verifiedAt: string;
  isVerified: boolean;
}

export interface ReportLocation {
  name: string;
  ward: string;
  zone: string;
  latitude: number;
  longitude: number;
  landmark?: string;
}

export type ReportStatus =
  | 'Assigned'
  | 'In Progress'
  | 'Collected'
  | 'Completed'
  | 'Verified'
  | 'Needs Review';

export interface AssignedWorker {
  id: string;
  name: string;
  badge: string;
  phone: string;
  vehicle: string;
}

export interface WasteReport {
  id: string; // e.g. "SW-2026-00142"
  imageUrl: string;
  afterImageUrl?: string;
  location: ReportLocation;
  reportedAt: string;
  status: ReportStatus;
  language?: 'en' | 'te';
  assignedWorker?: AssignedWorker;
  aiAnalysis: SimplifiedAIAnalysis;
  verification?: SimpleVerificationResult;
}

export interface RecurringHotspot {
  id: string;
  title: string;
  titleTe: string;
  locationName: string;
  ward: string;
  zone: string;
  reportsCount30Days: number;
  primaryWaste: string;
  primaryWasteTe: string;
  recurrenceLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  rootCause: string;
  rootCauseTe: string;
  recommendedAction: string;
  recommendedActionTe: string;
  coordinates: { lat: number; lng: number };
}

export interface WardMetric {
  ward: string;
  name: string;
  zone: string;
  totalReports: number;
  activeTasks: number;
  resolvedToday: number;
  avgResponseHours: number;
  segregationComplianceRate: number;
}
