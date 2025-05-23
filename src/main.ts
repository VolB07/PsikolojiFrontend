import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Eğer router kullanıyorsan
import { Observable } from 'rxjs';
import { AuthService } from './app/services/auth.service';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes), // Yönlendirme kullanıyorsan doğru
    AuthService
  ]
}).catch(err => console.error('Uygulama başlatılamadı!', err));
