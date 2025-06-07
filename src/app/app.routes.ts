import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./components/user-detail/user-detail.component').then(m => m.UserDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
