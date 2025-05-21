import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesService } from '../services/services.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
  <div class="admin-container">
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

    <!-- İçerik Alanı -->
    <div class="services-container">
      <h2>🛠 Hizmet Yönetimi</h2>
      
      <button (click)="showForm()" class="add-btn">➕ Yeni Hizmet Ekle</button>
      
      <table>
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Açıklama</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let service of services">
            <td>{{ service.title }}</td>
            <td>{{ service.description }}</td>
            <td>
              <button class="edit-btn" (click)="editService(service)">✏️ Düzenle</button>
              <button class="delete-btn" (click)="deleteService(service.id)">🗑 Sil</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Form -->
      <div *ngIf="isFormVisible" class="form-container">
        <h3>{{ serviceId ? 'Hizmeti Güncelle' : 'Yeni Hizmet Ekle' }}</h3>

        <form [formGroup]="serviceForm" (ngSubmit)="saveService()">
          <label>Başlık:</label>
          <input type="text" formControlName="title" required>

          <label>Açıklama:</label>
          <textarea formControlName="description" rows="5" required></textarea>

          <div class="form-actions">
            <button type="submit" class="save-btn" [disabled]="serviceForm.invalid">
              {{ serviceId ? 'Güncelle' : 'Ekle' }}
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
    .services-container { max-width: 900px; margin: auto; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    th, td { border-bottom: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #f4f4f4; }
    .edit-btn, .delete-btn, .add-btn { background: #007bff; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer; margin-right: 5px; }
    .delete-btn { background: #dc3545; }
    .edit-btn:hover, .delete-btn:hover, .add-btn:hover { opacity: 0.8; }
    .loading { text-align: center; font-weight: bold; }
    .form-container { margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .form-actions { display: flex; justify-content: space-between; margin-top: 10px; }
    .save-btn { background: #007bff; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; }
    .cancel-btn { background: #6c757d; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; }
    textarea, input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
    .admin-container {
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

    .services-container {
      margin-left: 270px;
      padding: 20px;
      width: calc(100% - 270px);
    }
    `
  ]
})
export class AdminServicesComponent implements OnInit {
  serviceForm: FormGroup;
  services: any[] = [];
  isLoading = true;
  isFormVisible = false;
  serviceId: number | null = null;

  constructor(private fb: FormBuilder, private serviceService: ServicesService) {
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadServiceData();
  }

  loadServiceData() {
    this.serviceService.getServices().subscribe(
      (data) => {
        this.services = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('API Hatası:', error);
        this.isLoading = false;
      }
    );
  }

  showForm() {
    this.serviceId = null;
    this.serviceForm.reset();
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  editService(service: any) {
    this.serviceId = service.id;
    this.serviceForm.patchValue(service);
    this.isFormVisible = true;
  }

  saveService() {
    if (this.serviceForm.valid) {
      const serviceData = { ...this.serviceForm.value, id: this.serviceId };

      if (this.serviceId) {
        this.serviceService.updateService(this.serviceId, serviceData).subscribe(
          () => {
            this.loadServiceData();
            this.hideForm();
            alert("Hizmet başarıyla güncellendi!");
          },
          (error) => {
            console.error('Güncelleme hatası:', error);
          }
        );
      } else {
        this.serviceService.createService(serviceData).subscribe(
          () => {
            this.loadServiceData();
            this.hideForm();
            alert("Hizmet başarıyla eklendi!");
          },
          (error) => {
            console.error('Ekleme hatası:', error);
          }
        );
      }
    }
  }

  deleteService(id: number) {
    if (confirm("Bu hizmeti silmek istediğinize emin misiniz?")) {
      this.serviceService.deleteService(id).subscribe(
        () => {
          this.loadServiceData();
          alert("Hizmet başarıyla silindi!");
        },
        (error) => {
          console.error('Silme hatası:', error);
        }
      );
    }
  }
}
