import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogsService } from '../services/blogs.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,ReactiveFormsModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent implements OnInit {
  faInstagram = faInstagram;
  faLinkedin = faLinkedin;
  blog: any;
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogsService);

  ngOnInit() {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.blogService.getBlogById(+blogId).subscribe(
        (data) => {
          this.blog = data;
        },
        (error) => {
          console.error('Blog detayını çekerken hata oluştu:', error);
        }
      );
    }
  }
}
