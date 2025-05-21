import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  private apiUrl = 'https://psikolojibackend.onrender.com/api/Blogs';

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createBlog(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateBlog(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getBlogById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
}
