export type TransactionStatus =
  | 'processing'
  | 'approved'
  | 'action_required'
  | 'otp_sent'
  | 'otp_verified'
  | 'blocked';

export type DeviceType = 'Mobile' | 'Desktop' | 'Tablet';

export interface GeoCity {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  recipientMasked: string;
  device: DeviceType;
  city: GeoCity;
  timestamp: Date;
  status: TransactionStatus;
  previousTransaction?: Transaction;
  distanceKm?: number;
  timeDiffMinutes?: number;
  isSuspicious: boolean;
  otpCode?: string;
  otpAttempts: number;
  otpMaxAttempts: number;
  fraudReason?: string;
  demoPhone?: string;
  checkTimeline: CheckEvent[];
}

export interface CheckEvent {
  time: Date;
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
}

export interface AppStats {
  total: number;
  approved: number;
  actionRequired: number;
  blocked: number;
  otpSent: number;
  otpVerified: number;
  otpFailed: number;
}

export interface AppSettings {
  distanceThresholdKm: number;
  timeThresholdMinutes: number;
  intervalMinMs: number;
  intervalMaxMs: number;
  isMonitoring: boolean;
  demoMode: boolean;
}

export interface Customer {
  id: string;
  name: string;
  lastTransaction?: Transaction;
}
