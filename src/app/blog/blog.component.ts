import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { BlogsService } from '../services/blogs.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule, RouterModule, HttpClientModule],
  providers: [BlogsService], // ✅ Servisi burada ekledik!
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'] // ✅ Yanlış yazımı düzelttik!
})
export class BlogComponent {
  faInstagram = faInstagram;
  faLinkedin = faLinkedin;
  blogs: any[] = [];

  constructor(private blogService: BlogsService) {}

  ngOnInit(): void {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.blogService.getBlogs().subscribe(
      (data) => {
        this.blogs = data;
      },
      (error) => {
        console.error('Blogları çekerken hata oluştu:', error);
      }
    );
  }
}
