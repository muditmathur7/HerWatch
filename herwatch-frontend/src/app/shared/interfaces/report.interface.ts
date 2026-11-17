export interface IncidentReport {
  id: number;
  userId?: number;
  incidentType: string;
  locationName: string;
  description: string;
  latitude?: number;
  longitude?: number;
  severity: string;
  createdAt: string;
}

export interface IncidentCreate {
  incidentType: string;
  locationName: string;
  description: string;
  latitude?: number;
  longitude?: number;
  severity?: string;
}

export interface HotspotZone {
  latitude: number;
  longitude: number;
  locationName: string;
  incidentCount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  types: string[];
}
