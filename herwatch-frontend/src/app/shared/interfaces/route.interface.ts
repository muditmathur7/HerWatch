export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  isSafeCorridor: boolean;
  note?: string;
}

export interface RouteOption {
  routeType: 'SAFEST' | 'FASTEST';
  name: string;
  coordinates: [number, number][];
  distanceKm: number;
  durationMins: number;
  safetyScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  hotspotsEncountered: number;
  safeHavensAlongRoute: number;
  steps: RouteStep[];
}

export interface SafeHaven {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
}

export interface SafeRouteResponse {
  safestRoute: RouteOption;
  fastestRoute: RouteOption;
  hotspots: any[];
  safeHavens: SafeHaven[];
}

export interface RouteRequest {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  destinationName?: string;
}
