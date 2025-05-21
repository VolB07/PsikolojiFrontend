import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common'; // CommonModule burada kullanılıyor
import { forkJoin } from 'rxjs';

interface Service {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule, HttpClientModule], // BrowserModule kaldırıldı
})
export class HomeComponent implements OnInit {
  faInstagram = faInstagram;
  faLinkedin = faLinkedin;
  contactForm: FormGroup;
  services: Service[] = [];
  aboutData: any;
  galleryImages: any[] = [];
  contactData: any[] = [];
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object, // SSR kontrolü için platform ID'si
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Tarayıcı ortamındaysanız işlemleri başlatın
      this.handleScroll();
      this.initScrollReveal();
    }

    // Verileri yükleyelim
    this.loadAllData();
  }

  private handleScroll(): void {
    const header = document.querySelector('.header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
  }

  private initScrollReveal(): void {
    // Scroll animasyonlarını başlatabiliriz
  }

  makeAppointment() {
    // Randevu alınıp yönlendirme yapılacak
    alert('Randevunuz alındı.');
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return control?.invalid && control?.touched ? true : false;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      alert('Mesajınız başarıyla gönderildi!');
      this.contactForm.reset();
    }
  }


  


  // Verilerin hepsini aynı anda yüklemek
  private loadAllData(): void {
    forkJoin({
      about: this.http.get<any>('https://psikolojibackend.onrender.com/api/About'),
      services: this.http.get<any[]>('https://psikolojibackend.onrender.com/api/Services'),
      gallery: this.http.get<any[]>('https://psikolojibackend.onrender.com/api/Galleries'),
      contacts: this.http.get<any>('https://psikolojibackend.onrender.com/api/Contacts'),
    }).subscribe(
      (results) => {
        this.aboutData = Array.isArray(results.about) && results.about.length > 0 ? results.about[0] : null;
        this.services = results.services;
        this.galleryImages = results.gallery;
        this.contactData = results.contacts;

        console.log('Tüm veriler yüklendi:', results);
      },
      (error) => {
        console.error('API verileri yüklenirken hata oluştu:', error);
      }
    );
  }
}
