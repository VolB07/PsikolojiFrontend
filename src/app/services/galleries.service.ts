import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GalleriesService {
  private apiUrl = 'https://psikolojibackend.onrender.com/api/Galleries';

  constructor(private http: HttpClient) { }

  getGalleries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  uploadImage(file: File, altText: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alttext', altText || ''); // 🟢 'altText' olmalı, 'alt_text' değil!

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }



  deleteGallery(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
