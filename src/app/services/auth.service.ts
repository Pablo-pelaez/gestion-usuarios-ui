import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MockApiService } from './mock-api.service';
import { LoginCredentials, AuthResponse, User } from '../models/user.model';

/**
 * Servicio para manejar la autenticación del usuario
 * Gestiona el estado de autenticación y el almacenamiento de tokens
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Estado de autenticación reactivo
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();


  constructor(private mockApiService: MockApiService) {
    // Verificar si hay una sesión activa al inicializar
    this.checkStoredSession();
  }

  /**
   * Verifica si existe una sesión almacenada localmente
   */
  private checkStoredSession(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('current_user');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
        } catch (error) {
          this.clearSession(); // Si los datos están corruptos
        }
      }
    }
  }

  /**
   * Realiza el proceso de inicio de sesión
   * @param credentials - Credenciales del usuario
   * @returns Observable con la respuesta de autenticación
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.mockApiService.login(credentials).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          // Almacenar datos de sesión
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('current_user', JSON.stringify(response.user));

          // Actualizar estado reactivo
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.clearSession();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Limpia los datos de sesión almacenados
   */
  private clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si está autenticado, false en caso contrario
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtiene el usuario actual
   * @returns Usuario actual o null si no está autenticado
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
