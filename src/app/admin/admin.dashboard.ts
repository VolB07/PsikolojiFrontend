import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-container">
      <aside class="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="#home">Ana Sayfa</a></li>
          <li><a href="/admin/about">Hakkımızda Yönetimi</a></li>
          <li><a href="/admin/blogs">Blog Yönetimi</a></li>
          <li><a href="/admin/contact">İletişim Bilgileri</a></li>
          <li><a href="/admin/gallery">Galeri Yönetimi</a></li>
          <li><a href="/admin/services">Hizmetler Yönetimi</a></li>
        </ul>
      </aside>
      <main class="content">
        <h1>Hoş Geldiniz</h1>
        <p>Admin paneline hoş geldiniz. Yönetmek istediğiniz bölümü seçin.</p>
      </main>
    </div>
  `,
  styles: [
    `
      .admin-container {
        display: flex;
        height: 100vh;
      }
      .sidebar {
        width: 250px;
        background: #333;
        color: white;
        padding: 20px;
      }
      .sidebar h2 {
        text-align: center;
        margin-bottom: 20px;
      }
      .sidebar ul {
        list-style: none;
        padding: 0;
      }
      .sidebar ul li {
        margin: 10px 0;
      }
      .sidebar ul li a {
        color: white;
        text-decoration: none;
        display: block;
        padding: 10px;
        border-radius: 5px;
        transition: background 0.3s;
      }
      .sidebar ul li a:hover {
        background: #555;
      }
      .content {
        flex-grow: 1;
        padding: 20px;
        text-align: center;
      }
    `
  ]
})
export class AdminDashboardComponent {
  role: string | null = '';

  constructor(private authService: AuthService, private router: Router) {
    this.role = this.authService.getRole(); // Kullanıcının rolünü al
    if (!this.role || this.role !== 'admin') {
      this.router.navigate(['/login']); // Eğer admin değilse login sayfasına yönlendir
    }
  }

  logout() {
    this.authService.logout(); // Çıkış yap
    this.router.navigate(['/login']); // Logout sonrası login sayfasına yönlendir
  }
}
