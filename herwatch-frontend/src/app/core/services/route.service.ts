import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouteRequest, SafeRouteResponse, RouteOption } from '../../shared/interfaces/route.interface';
import { environment } from '../../../environments/environment';

export type { RouteRequest, SafeRouteResponse, RouteOption };

@Injectable({ providedIn: 'root' })
export class RouteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/routes`;

  calculateSafeRoute(req: RouteRequest): Observable<SafeRouteResponse> {
    return this.http.post<SafeRouteResponse>(`${this.apiUrl}/safe-route`, req);
  }
}
