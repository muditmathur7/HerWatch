import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmergencyContact, ContactCreate } from '../../shared/interfaces/contact.interface';
import { environment } from '../../../environments/environment';

export type { EmergencyContact, ContactCreate };

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contacts`;

  getContacts(): Observable<EmergencyContact[]> {
    return this.http.get<EmergencyContact[]>(this.apiUrl);
  }

  addContact(contact: ContactCreate): Observable<EmergencyContact> {
    return this.http.post<EmergencyContact>(this.apiUrl, contact);
  }

  updateContact(id: number, contact: Partial<ContactCreate>): Observable<EmergencyContact> {
    return this.http.put<EmergencyContact>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
