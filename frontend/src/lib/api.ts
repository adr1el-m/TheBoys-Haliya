export interface TriageRequest {
  symptoms: string;
  age?: number;
  sex?: string;
  duration?: string;
  conditions?: string[];
  language?: string;
  session_token?: string;
  region?: string;
}

export interface DifferentialDiagnosis {
  condition: string;
  likelihood: 'High' | 'Moderate' | 'Low';
  reasoning: string;
}

export interface TriageResponse {
  urgency_level: 'self-care' | 'clinic' | 'er' | 'emergency';
  urgency_score: number;
  classification?: string;
  summary: string;
  differential_diagnosis?: DifferentialDiagnosis[];
  red_flags?: string[];
  recommended_facility_type?: string;
  next_steps: string[];
  explanation: string;
  confidence_level?: number;
  pattern_detected?: boolean;
  pattern_description?: string;
}

export interface DashboardSummary {
  total_reports_today: number;
  avg_urgency_score: number;
  most_affected_region: string;
  active_alerts: number;
}

export interface RegionStat {
  region: string;
  report_count: number;
  avg_urgency: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export interface Alert {
  id: string;
  symptom_cluster: string;
  region: string;
  spike_percentage: number;
  severity: 'watch' | 'alert' | 'warning';
  message: string;
  created_at: string;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getTriage(data: TriageRequest): Promise<TriageResponse> {
  const response = await fetch(`${API_URL}/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to get triage result');
  return response.json();
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(`${API_URL}/dashboard/summary`);
  if (!response.ok) throw new Error('Failed to fetch dashboard summary');
  return response.json();
}

export async function getByRegion(): Promise<RegionStat[]> {
  const response = await fetch(`${API_URL}/dashboard/regional`);
  if (!response.ok) throw new Error('Failed to fetch regional stats');
  return response.json();
}

export async function getTrend(): Promise<TrendData[]> {
  const response = await fetch(`${API_URL}/dashboard/trends`);
  if (!response.ok) throw new Error('Failed to fetch trend data');
  return response.json();
}

export async function getActiveAlerts(): Promise<Alert[]> {
  const response = await fetch(`${API_URL}/alerts`);
  if (!response.ok) throw new Error('Failed to fetch active alerts');
  return response.json();
}

export async function getHistory(token: string): Promise<{ history: any[], summary: string }> {
  const response = await fetch(`${API_URL}/triage/history?token=${token}`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}

export async function generateIntelligence(): Promise<{ message: string, alerts_generated: number }> {
  const response = await fetch(`${API_URL}/intelligence/generate`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to generate intelligence');
  return response.json();
}

export interface HealthSummary {
  summary: string;
  trend: 'improving' | 'stable' | 'worsening';
  top_symptom: string | null;
  risk_level: 'low' | 'moderate' | 'high';
  report_count: number;
}

export interface PatientProfile {
  id: string;
  email: string;
  full_name?: string | null;
  personal_info?: {
    phone?: string;
    address?: string;
    dateOfBirth?: string;
  };
  medical_info?: {
    allergies?: string[];
    surgeries?: string[];
    medications?: string[];
    conditions?: Record<string, unknown>;
  };
}

export interface FacilityProfile {
  id: string;
  name: string;
  type?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country?: string | null;
  website?: string | null;
  specialties?: string[];
  services?: string[];
  operating_hours?: Record<string, unknown>;
  staff?: Record<string, unknown>;
  capacity?: Record<string, unknown>;
  languages?: string[];
  accreditation?: string[];
  insurance_accepted?: string[];
  license_number?: string | null;
  description?: string | null;
}

export async function getHealthSummary(token: string): Promise<HealthSummary> {
  const response = await fetch(`${API_URL}/triage/health-summary?token=${token}`);
  if (!response.ok) throw new Error('Failed to fetch health summary');
  return response.json();
}

export async function getPatientProfile(token: string): Promise<PatientProfile> {
  const response = await fetch(`${API_URL}/patients/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch patient profile');
  return response.json();
}

export async function updatePatientProfile(token: string, payload: Partial<PatientProfile>): Promise<PatientProfile> {
  const response = await fetch(`${API_URL}/patients/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update patient profile');
  return response.json();
}

export async function getFacilityProfile(token: string): Promise<FacilityProfile> {
  const response = await fetch(`${API_URL}/facilities/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch facility profile');
  return response.json();
}

export async function updateFacilityProfile(token: string, payload: Partial<FacilityProfile>): Promise<FacilityProfile> {
  const response = await fetch(`${API_URL}/facilities/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update facility profile');
  return response.json();
}

export interface TopSymptom {
  symptom: string;
  count: number;
}

export async function getTopSymptoms(): Promise<TopSymptom[]> {
  const response = await fetch(`${API_URL}/dashboard/top-symptoms`);
  if (!response.ok) throw new Error('Failed to fetch top symptoms');
  return response.json();
}
