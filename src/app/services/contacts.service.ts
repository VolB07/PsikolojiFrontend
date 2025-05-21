import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = 'https://psikolojibackend.onrender.com/api/Contacts';

  constructor(private http: HttpClient) {}

  getContact(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateContact(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }
  
  
}
