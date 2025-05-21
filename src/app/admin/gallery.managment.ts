import { Component, OnInit } from '@angular/core';
import { GalleriesService } from '../services/galleries.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
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
  
  <div class="gallery-container">
    <h2>🖼️ Galeri Yönetimi</h2>
    <div *ngIf="isLoading" class="loading">Yükleniyor...</div>
    
    <table *ngIf="!isLoading">
      <thead>
        <tr>
          <th>Görsel</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let image of gallery">
          <td><img [src]="'https://psikolojibackend.onrender.com' + image.image_url" alt="{{ image.alt_text }}"  class="thumbnail"></td>
          <td>
            <button class="delete-btn" (click)="deleteImage(image.id)">🗑 Sil</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div *ngIf="!isLoading" class="form-container">
      <h3>Yeni Görsel Yükle</h3>
      <form (ngSubmit)="uploadImage()">
        <input type="file" (change)="onFileSelected($event)" accept="image/*" required>
        <input type="text" [(ngModel)]="altText" placeholder="Alternatif metin" required>

        <button type="submit" [disabled]="!selectedFile" class="upload-btn">📤 Yükle</button>
      </form>
    </div>
  </div>
</div>

  `,
  styles: [
    `
    .gallery-container { max-width: 900px; margin: auto; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    th, td { border-bottom: 1px solid #ddd; padding: 10px; text-align: center; }
    th { background: #f4f4f4; }
    .thumbnail { 
      width: 50px; /* Küçük boyutlandırma */
      height: auto; 
      border-radius: 5px;
      object-fit: cover; /* Görselin orantılı şekilde sığmasını sağlar */
    }
    .delete-btn { background: #d9534f; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer; }
    .delete-btn:hover { opacity: 0.8; }
    .upload-btn { background: #007bff; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; }
    .form-container { margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    input[type="file"], input[type="text"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin: 10px 0; }
    input[type="text"] { font-size: 14px; }
    /* Admin container setup */
.admin-container {
  display: flex;
}

/* Sidebar style */
.sidebar {
  width: 250px;
  background: #333;
  color: white;
  padding: 5px;
  position: fixed;
  height: 100%;  /* Sayfa yüksekliği kadar uzunluk */

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

/* Main content area */
.gallery-container {
  margin-left: 270px; /* Sidebar genişliği kadar boşluk bırak */
  padding: 20px;
  width: calc(100% - 270px);
}

/* Thumbnail style */
.thumbnail {
  width: 50px;
  height: auto;
  border-radius: 5px;
  object-fit: cover;
}

/* Button styles */
.delete-btn {
  background: #d9534f;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  opacity: 0.8;
}

.upload-btn {
  background: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-container {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

input[type="file"], input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 10px 0;
}

input[type="text"] {
  font-size: 14px;
}
 `
  ]
})
export class AdminGalleryComponent implements OnInit {
  gallery: any[] = [];
  selectedFile: File | null = null;
  altText: string = 'ssss'; // Yeni alt metin değişkeni
  isLoading: boolean = true;

  constructor(private galleryService: GalleriesService) { }

  ngOnInit(): void {
    this.loadGallery();
  }

  loadGallery() {
    this.galleryService.getGalleries().subscribe(
      (data) => {
        this.gallery = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Galeri verileri yüklenirken hata oluştu:', error);
        this.isLoading = false;
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  uploadImage() {
    if (!this.selectedFile) return;

    if (!this.altText || this.altText.trim() === '') {
      alert('Lütfen alternatif metin (altText) giriniz.');
      return;
    }

    this.galleryService.uploadImage(this.selectedFile, this.altText.trim()).subscribe(
      () => {
        this.loadGallery();
        this.selectedFile = null;
        this.altText = ''; // Formu sıfırla
        alert('Görsel başarıyla yüklendi!');
      },
      (error) => {
        console.error('Yükleme hatası:', error);
        alert('Yükleme sırasında hata oluştu.');
      }
    );
  }


  deleteImage(id: number) {
    if (confirm('Bu görseli silmek istediğinizden emin misiniz?')) {
      this.galleryService.deleteGallery(id).subscribe(
        () => {
          this.loadGallery();
          alert('Görsel başarıyla silindi!');
        },
        (error) => {
          console.error('Silme hatası:', error);
          alert('Görsel silinemedi.');
        }
      );
    }
  }
}
