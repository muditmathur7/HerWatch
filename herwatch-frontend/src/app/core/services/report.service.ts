import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncidentReport, IncidentCreate, HotspotZone } from '../../shared/interfaces/report.interface';
import { environment } from '../../../environments/environment';

export type { IncidentReport, IncidentCreate, HotspotZone };

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reports`;

  getReports(limit = 50): Observable<IncidentReport[]> {
    return this.http.get<IncidentReport[]>(`${this.apiUrl}?limit=${limit}`);
  }

  submitReport(report: IncidentCreate): Observable<IncidentReport> {
    return this.http.post<IncidentReport>(this.apiUrl, report);
  }

  getHotspots(): Observable<HotspotZone[]> {
    return this.http.get<HotspotZone[]>(`${this.apiUrl}/hotspots`);
  }
}
