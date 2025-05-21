import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../services/contacts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-contact',
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
    <div class="contact-container">
      <h2>📞 İletişim Yönetimi</h2>

      <table *ngIf="!isLoading">
        <thead>
          <tr>
            <th>E-posta</th>
            <th>Telefon</th>
            <th>Adres</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ contact?.email }}</td>
            <td>{{ contact?.whatsapp }}</td>
            <td>{{ contact?.address }}</td>
            <td>
              <button class="edit-btn" (click)="showForm()">✏️ Düzenle</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="isLoading" class="loading">Veri yükleniyor...</div>

      <!-- Form -->
      <div *ngIf="isFormVisible" class="form-container">
        <h3>İletişim Bilgilerini Güncelle</h3>
        <form [formGroup]="contactForm" (ngSubmit)="updateContact()">
          <label for="email">E-posta:</label>
          <input id="email" formControlName="email" required />

          <label for="whatsapp">Telefon:</label>
          <input id="whatsapp" formControlName="whatsapp" required />

          <label for="address">Adres:</label>
          <textarea id="address" formControlName="address" rows="3" required></textarea>

          <div class="form-actions">
            <button type="submit" class="save-btn" [disabled]="contactForm.invalid">Güncelle</button>
            <button type="button" class="cancel-btn" (click)="hideForm()">İptal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
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

    .contact-container {
      margin-left: 270px;
      padding: 20px;
      width: calc(100% - 270px);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    th, td {
      border-bottom: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }

    th {
      background: #f4f4f4;
    }

    .edit-btn {
      background: #007bff;
      color: white;
      padding: 5px 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .edit-btn:hover {
      opacity: 0.8;
    }

    .loading {
      text-align: center;
      font-weight: bold;
    }

    .form-container {
      margin-top: 20px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }

    .save-btn {
      background: #007bff;
      color: white;
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .cancel-btn {
      background: #6c757d;
      color: white;
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    textarea, input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }
    `
  ]
})
export class AdminContactComponent implements OnInit {
  contactForm: FormGroup;
  isLoading = true;
  isFormVisible = false;
  contact: any;

  constructor(private fb: FormBuilder, private contactsService: ContactsService) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadContactData();
  }

  loadContactData() {
    this.contactsService.getContact().subscribe(
      (data) => {
        if (!data || data.length === 0) {
          console.error('Hata: API boş veya geçersiz veri döndürdü.');
          return;
        }

        this.contact = data[0];
        this.contactForm.patchValue(this.contact);
        this.isLoading = false;
      },
      (error) => {
        console.error('API Hatası:', error);
        this.isLoading = false;
      }
    );
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
  }

  updateContact() {
    if (this.contactForm.valid) {
      const contactData = { ...this.contactForm.value, id: this.contact.id };
      
      this.contactsService.updateContact(this.contact.id, contactData).subscribe(
        () => {
          this.contact = contactData;
          this.isFormVisible = false;
          alert("İletişim Bilgileri Başarıyla Güncellendi")
        },
        (error) => {
          console.error('Güncelleme hatası:', error);
          alert("İletişim Bilgileri Güncellemesi Hatalı")
        }
      );
    }
  }
}