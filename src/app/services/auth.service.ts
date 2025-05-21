import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'https://psikolojibackend.onrender.com/api/Auth'; // API'nizin adresini buraya koyun

    constructor(private http: HttpClient) { }

    // Login işlemi
    login(username: string, password: string): Observable<any> {
        const body = { username, password_hash: password };
        return this.http.post<any>(`${this.apiUrl}/login`, body);
    }

    // Token'ı al ve her istekte başlığa ekle
    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
        };
    }

    getToken(): string | null {
        return localStorage.getItem('token'); // Token'ı localStorage'dan al
    }


    // Kullanıcı giriş yaptıysa, token'ı localStorage'a kaydedin
    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    // Token'ı kaldır
    logout() {
        localStorage.removeItem('token');
    }

    // Token kontrolü
    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    // Kullanıcı rolünü al
    getRole(): string | null {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1])); // Base64 decoding
                console.log('Decoded Payload:', payload); 
                return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; 
            } catch (error) {
                console.error('JWT decoding hatası:', error);
                return null;
            }
        }
        return null;
    }





    // Kullanıcı rolünü localStorage'a kaydedin
    setRole(role: string) {
        localStorage.setItem('role', role); // Rol bilgisini localStorage'a kaydedin
    }
}



