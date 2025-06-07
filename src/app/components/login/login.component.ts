import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";

/**
 * Componente para el inicio de sesión de usuarios
 * Maneja la validación de credenciales y redirección
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializar el formulario reactivo con validaciones
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir a la lista de usuarios
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/users']);
    }
  }

  /**
   * Maneja el envío del formulario de login
   */
  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/users']);
          } else {
            this.errorMessage = response.message || 'Error en el inicio de sesión';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
          console.error('Error de login:', error);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores de validación
      this.markFormGroupTouched();
    }
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Marca todos los campos del formulario como tocados
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Verifica si un campo específico tiene errores y ha sido tocado
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName === 'username' ? 'Usuario' : 'Contraseña'} es requerido`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
    }
    return '';
  }
}
