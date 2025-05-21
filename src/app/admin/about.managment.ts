import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AboutService } from '../services/about.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
  <div class="admin-page">
    <!-- Sidebar -->
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

    <!-- Ana İçerik -->
    <div class="content">
      <h2>📄 Hakkımızda Yönetimi</h2>

      <table>
        <thead>
          <tr>
            <th>İsim</th>
            <th>Üniversite</th>
            <th>Deneyim</th>
            <th>Resim</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let about of abouts">
            <td>{{ about.name }}</td>
            <td>{{ about.university }}</td>
            <td>{{ about.experience }}</td>
            <td><a [href]="about.image_url" target="_blank">Resmi Gör</a></td>
            <td>
              <button class="edit-btn" (click)="editAbout(about)">✏️ Düzenle</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Form -->
      <div *ngIf="isFormVisible" class="form-container">
        <h3>{{ aboutId ? 'Bilgiyi Güncelle' : 'Yeni Bilgi Ekle' }}</h3>

        <form [formGroup]="aboutForm" (ngSubmit)="saveAbout()">
          <label>İsim:</label>
          <input type="text" formControlName="name" required>

          <label>Üniversite:</label>
          <input type="text" formControlName="university" required>

          <label>Deneyim:</label>
          <input type="text" formControlName="experience" required>

          <label>Açıklama:</label>
          <textarea formControlName="description" rows="5" required></textarea>

          <label>Resim URL:</label>
          <input type="url" formControlName="image_url" required>

          <div class="form-actions">
            <button type="submit" class="save-btn" [disabled]="aboutForm.invalid">
              {{ aboutId ? 'Güncelle' : 'Ekle' }}
            </button>
            <button type="button" class="cancel-btn" (click)="hideForm()">İptal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
    .admin-page {
      display: flex;
    }
    .sidebar {
      width: 250px;
      background: #333;
      color: white;
      padding: 5px;
      position: fixed;
      height: 100%; 
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
      margin-left: 270px; /* Sidebar genişliği kadar boşluk bırak */
      padding: 20px;
      width: calc(100% - 270px);
    }

    .about-container { max-width: 900px; margin: auto; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    th, td { border-bottom: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #f4f4f4; }
    .edit-btn { background: #007bff; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer; }
    .edit-btn:hover { opacity: 0.8; }
    .loading { text-align: center; font-weight: bold; }
    .form-container { margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .form-actions { display: flex; justify-content: space-between; margin-top: 10px; }
    .save-btn { background: #007bff; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; }
    .cancel-btn { background: #6c757d; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; }
    textarea, input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
    `
  ]
})
export class AdminAboutComponent implements OnInit {
  aboutForm: FormGroup;
  abouts: any[] = [];
  isLoading = true;
  isFormVisible = false;
  message: string | null = null;
  aboutId: number | null = null;

  constructor(private fb: FormBuilder, private aboutService: AboutService) {
    this.aboutForm = this.fb.group({
      name: ['', Validators.required],
      university: ['', Validators.required],
      experience: ['', Validators.required],
      description: ['', Validators.required],
      image_url: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAboutData();
  }

  loadAboutData() {
    this.aboutService.getAbout().subscribe(
      (data) => {
        if (!data || data.length === 0) {
          console.error('Hata: API boş veya geçersiz veri döndürdü.');
          return;
        }
        this.abouts = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('API Hatası:', error);
        this.isLoading = false;
      }
    );
  }

  showForm() {
    this.aboutId = null;
    this.aboutForm.reset();
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  editAbout(about: any) {
    this.aboutId = about.id;
    this.aboutForm.patchValue(about);
    this.isFormVisible = true;
  }

  saveAbout() {
    if (this.aboutForm.valid) {
      const aboutData = { ...this.aboutForm.value, id: this.aboutId };

      if (this.aboutId) {
        this.aboutService.updateAbout(this.aboutId, aboutData).subscribe(
          () => {
            this.message = 'Veri başarıyla güncellendi!';
            this.loadAboutData();
            this.hideForm();
            alert("Hakkımızda Bilgileri Başarıyla Güncellendi")
          },
          (error) => {
            console.error('Güncelleme hatası:', error);
          }
        );
      }
    }
  }
}
