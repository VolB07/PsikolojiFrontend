import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiUrl = 'https://psikolojibackend.onrender.com/api/Services';

  constructor(private http: HttpClient) {}

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createService(data: any): Observable<any> {
    const newData = { ...data };
    delete newData.id; // id alanını tamamen kaldır, API sıfırdan oluştursun
    return this.http.post<any>(this.apiUrl, newData);
  }
  

  updateService(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
