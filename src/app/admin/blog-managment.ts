import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogsService } from '../services/blogs.service';
import { QuillModule } from 'ngx-quill';


@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, QuillModule],
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

    <!-- Blog Yönetimi İçeriği -->
    <div class="blog-container">
      <h2>📝 Blog Yönetimi</h2>

      <button class="add-btn" (click)="showForm()">+ Yeni Blog Ekle</button>

      <table>
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Özet</th>
            <th>Resim URL</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let blog of blogs">
            <td>{{ blog.title }}</td>
            <td>{{ blog.summary }}</td>
            <td><a [href]="blog.image_url" target="_blank">Resmi Gör</a></td>
            <td>
              <button class="edit-btn" (click)="editBlog(blog)">✏️ Düzenle</button>
              <button class="delete-btn" (click)="deleteBlog(blog.id)">🗑️ Sil</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Blog Ekle / Düzenle Formu -->
      <div *ngIf="isFormVisible" class="form-container">
        <h3>{{ selectedBlog.id ? 'Blog Güncelle' : 'Yeni Blog Ekle' }}</h3>
        
        <form [formGroup]="blogForm" (ngSubmit)="saveBlog()">
          <label>Başlık:</label>
          <input type="text" formControlName="title" required>
          
          <label>Özet:</label>
          <textarea formControlName="summary" rows="5" required></textarea>

          <label>İçerik:</label>
          <textarea formControlName="content" rows="10" required></textarea>

          <label>Resim URL:</label>
          <input type="url" formControlName="image_url" required>

          <div class="form-actions">
            <button type="submit" class="save-btn" [disabled]="blogForm.invalid">
              {{ selectedBlog.id ? 'Güncelle' : 'Ekle' }}
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

    .blog-container {
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

    .add-btn {
      background: #28a745;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-bottom: 15px;
    }

    .edit-btn {
      background: #007bff;
      color: white;
      padding: 5px 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .delete-btn {
      background: #dc3545;
      color: white;
      padding: 5px 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .edit-btn:hover, .delete-btn:hover, .add-btn:hover {
      opacity: 0.8;
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

    textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
    }

    input[type="text"], input[type="url"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      margin-bottom: 10px;
    }
    `
  ]
})  
export class BlogManagementComponent implements OnInit {
  blogs: any[] = [];
  blogForm: FormGroup;
  selectedBlog: any = { id: null, title: '', summary: '', image_url: '' };
  isFormVisible = false; // Formun görünürlüğünü kontrol eder

  constructor(private blogService: BlogsService, private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required], // content alanını ekleyin
      image_url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.blogService.getBlogs().subscribe(data => this.blogs = data);
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
    this.selectedBlog = { id: null, title: '', summary: '', image_url: '' };
    this.blogForm.reset();
  }


  saveBlog() {
    if (this.blogForm.invalid) {
      alert('Lütfen tüm alanları doğru şekilde doldurun.');
      return;
    }
  
    let blogData = { ...this.blogForm.value };
  
    if (this.selectedBlog.id) {
      // Güncelleme için id'yi dahil et
      blogData.id = this.selectedBlog.id;
      this.blogService.updateBlog(this.selectedBlog.id, blogData).subscribe({
        next: () => {
          this.loadBlogs();
          this.hideForm();
          alert('Blog Başarıyla Güncellendi');
        },
        error: (err) => {
          console.error('Güncelleme hatası:', err);
          alert('Blog güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      });
    } else {
      // Yeni blog oluşturulurken id'yi JSON'dan tamamen kaldır
      delete blogData.id;
      this.blogService.createBlog(blogData).subscribe({
        next: () => {
          this.loadBlogs();
          this.hideForm();
          alert('Blog Başarıyla Oluşturdu Ve Yüklendi');
        },
        error: (err) => {
          console.error('Oluşturma hatası:', err);
          alert('Blog oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
        }
      });
    }
  }
  
  
  editBlog(blog: any) {
    this.selectedBlog = { ...blog };
    this.blogForm.setValue({
      title: blog.title,
      summary: blog.summary,
      image_url: blog.image_url,
      content: blog.content
    });
    this.showForm();
  }

  deleteBlog(id: number) {
    if (confirm('Bu blogu silmek istediğinizden emin misiniz?')) {
      this.blogService.deleteBlog(id).subscribe(() => this.loadBlogs());
    }
  }
}


