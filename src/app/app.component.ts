import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-user-management';
  isLoggedIn = false;
  currentRoute = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    // Rastrear la ruta actual
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  get showNavigation(): boolean {
    return this.isLoggedIn && this.currentRoute !== '/login';
  }

  get isLoginRoute(): boolean {
    return this.currentRoute === '/login';
  }

  get isUsersRoute(): boolean {
    return this.currentRoute === '/users';
  }

  get isUserDetailRoute(): boolean {
    return (
      this.currentRoute.startsWith('/users/') && this.currentRoute !== '/users'
    );
  }
}
