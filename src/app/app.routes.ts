import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { AdminDashboardComponent } from './admin/admin.dashboard';
import { AdminAboutComponent } from './admin/about.managment';
import { BlogManagementComponent } from './admin/blog-managment';
import { AdminContactComponent } from './admin/contact.managment';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminServicesComponent } from './admin/service.managment';
import { AdminGalleryComponent } from './admin/gallery.managment';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'blog/:id', component: BlogDetailComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
      path: 'admin',
      component: AdminDashboardComponent,
      canActivate: [AuthGuard], // AuthGuard ile erişimi kontrol et
    },
    {
      path: 'admin/about',
      component: AdminAboutComponent,
      canActivate: [AuthGuard], // Admin paneline giriş kontrolü
    },
    {
      path: 'admin/blogs',
      component: BlogManagementComponent,
      canActivate: [AuthGuard], // Admin paneline giriş kontrolü
    },
    {
      path: 'admin/contact',
      component: AdminContactComponent,
      canActivate: [AuthGuard], // Admin paneline giriş kontrolü
    },
    {
      path: 'admin/services',
      component: AdminServicesComponent,
      canActivate: [AuthGuard], // Admin paneline giriş kontrolü
    },
    {
      path: 'admin/gallery',
      component: AdminGalleryComponent,
      canActivate: [AuthGuard], // Admin paneline giriş kontrolü
    },
    { path: '**', component: NotFoundComponent } // 📌 Geçersiz route'larda ana sayfaya yönlendirme
];
