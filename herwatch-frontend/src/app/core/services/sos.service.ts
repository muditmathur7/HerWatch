import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SOSAlert, SOSTriggerRequest, SOSLocationPing, SOSTrackingDetail, LocationLog } from '../../shared/interfaces/sos.interface';
import { environment } from '../../../environments/environment';

export type { SOSAlert, SOSTriggerRequest, SOSLocationPing, SOSTrackingDetail, LocationLog };

@Injectable({ providedIn: 'root' })
export class SosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sos`;

  triggerSOS(req: SOSTriggerRequest): Observable<SOSAlert> {
    return this.http.post<SOSAlert>(`${this.apiUrl}/trigger`, req);
  }

  getActiveSOS(): Observable<SOSAlert | null> {
    return this.http.get<SOSAlert | null>(`${this.apiUrl}/active`);
  }

  pingLocation(sosId: number, ping: SOSLocationPing): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(`${this.apiUrl}/${sosId}/location`, ping);
  }

  resolveSOS(sosId: number, pin?: string): Observable<SOSAlert> {
    return this.http.post<SOSAlert>(`${this.apiUrl}/${sosId}/resolve`, { pin: pin || null });
  }

  getTrackingDetail(sosId: number): Observable<SOSTrackingDetail> {
    return this.http.get<SOSTrackingDetail>(`${this.apiUrl}/${sosId}/track`);
  }
}
