import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'https://psikolojibackend.onrender.com/api/Auth';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object // platform kontrolü için ekledik
    ) { }

    // Login işlemi
    login(username: string, password: string): Observable<any> {
        const body = { username, password_hash: password };
        return this.http.post<any>(`${this.apiUrl}/login`, body);
    }

    // Header ayarı
    getHeaders() {
        const token = this.getToken();
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
        };
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
        return null;
    }

    setToken(token: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
        }
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
        }
    }

    isLoggedIn(): boolean {
        return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
    }

    getRole(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('Decoded Payload:', payload);
                    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                } catch (error) {
                    console.error('JWT decoding hatası:', error);
                    return null;
                }
            }
        }
        return null;
    }

    setRole(role: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('role', role);
        }
    }
}
