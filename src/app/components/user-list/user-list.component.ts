import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from '../error-message/error-message.component';

/**
 * Componente para mostrar la lista de usuarios
 * Permite navegar a los detalles de cada usuario y cerrar sesión
 */
@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [LoadingSpinnerComponent, CommonModule, ErrorMessageComponent],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  currentUser: User | null = null;

  // Subject para manejar la desuscripción automática
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });

    // Cargar la lista de usuarios
    this.loadUsers();
  }

  ngOnDestroy(): void {
    // Completar el subject para desuscribirse de observables
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga la lista de usuarios desde el servicio
   */
  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error al cargar los usuarios';
          this.isLoading = false;
          console.error('Error cargando usuarios:', error);
        },
      });
  }

  /**
   * Navega a la página de detalles del usuario seleccionado
   * @param userId - ID del usuario
   */
  viewUserDetails(userId: number): void {
    this.router.navigate(['/users', userId]);
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Reintentar cargar usuarios en caso de error
   */
  retryLoad(): void {
    this.loadUsers();
  }

  /**
   * Obtiene las iniciales del nombre completo para el avatar por defecto
   * @param user - Usuario
   * @returns Iniciales del usuario
   */
  getUserInitials(user: User): string {
    const firstName = user.firstName?.charAt(0).toUpperCase() || '';
    const lastName = user.lastName?.charAt(0).toUpperCase() || '';
    return firstName + lastName || user.username.charAt(0).toUpperCase();
  }

  /**
   * Maneja errores de carga de imágenes de avatar
   * @param event - Evento de error de imagen
   */
  onImageError(event: any): void {
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }

  // Función de seguimiento para ngFor
  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
