import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockApiService } from './mock-api.service';
import { User } from '../models/user.model';

/**
 * Servicio para manejar operaciones relacionadas con usuarios
 * Actúa como intermediario entre los componentes y la API
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private mockApiService: MockApiService) { }

  /**
   * Obtiene la lista de usuarios
   * @returns Observable con la lista de usuarios
   */
  getUsers(): Observable<User[]> {
    return this.mockApiService.getUsers();
  }

  /**
   * Obtiene los detalles de un usuario específico
   * @param userId - ID del usuario
   * @returns Observable con los detalles del usuario
   */
  getUserById(userId: number): Observable<User> {
    return this.mockApiService.getUserById(userId);
  }
}
