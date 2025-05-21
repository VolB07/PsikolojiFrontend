import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Eğer router kullanıyorsan

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes), // Yönlendirme kullanıyorsan doğru
  ]
}).catch(err => console.error('Uygulama başlatılamadı!', err));
