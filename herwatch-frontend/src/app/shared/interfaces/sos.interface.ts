export interface SOSAlert {
  id: number;
  userId: number;
  userName?: string;
  userPhone?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED';
  initialLatitude?: number;
  initialLongitude?: number;
  batteryLevel?: number;
  startedAt: string;
  resolvedAt?: string;
  notifiedContactsCount: number;
  trackingUrl?: string;
}

export interface SOSTriggerRequest {
  latitude?: number;
  longitude?: number;
  batteryLevel?: number;
}

export interface SOSLocationPing {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
}

export interface LocationLog {
  id: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  timestamp: string;
}

export interface SOSTrackingDetail {
  alert: SOSAlert;
  recentLocations: LocationLog[];
}
