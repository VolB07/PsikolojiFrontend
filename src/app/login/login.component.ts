import { Component, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log('Giriş başarılı:', response);  // Yanıtı kontrol edin
        if (response.token && response.role) {
          this.authService.setToken(response.token);
          this.authService.setRole(response.role);
          console.log("Admin sayfasına yönlendirildi"); // Yönlendirme işlemi öncesi log
          this.router.navigate(['/admin']); // Sayfayı yönlendir
        } else {
          this.errorMessage = 'Geçersiz yanıt.';
        }
      },
      (error) => {
        console.error('Giriş hatası:', error);
        this.errorMessage = 'Giriş başarısız.';
      }
    );
  }
  
  
  
}
