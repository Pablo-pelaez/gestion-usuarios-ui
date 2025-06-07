import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginCredentials, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  private mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      avatar: 'https://i.pravatar.cc/150?img=1',
      phone: '+57 300 123 4567',
      address: {
        street: 'Calle 123 #45-67',
        city: 'Medellín',
        zipcode: '050001'
      },
      company: {
        name: 'Tech Solutions',
        position: 'Administrador de Sistemas'
      },
      bio: 'Desarrollador Full Stack con más de 5 años de experiencia en tecnologías web.',
      website: 'https://juan.dev',
      isActive: true,
      createdAt: new Date('2023-01-10T10:00:00Z'),
      updatedAt: new Date('2024-06-01T12:00:00Z')
    },
    {
      id: 2,
      username: 'maria_garcia',
      email: 'maria.garcia@example.com',
      firstName: 'María',
      lastName: 'García',
      avatar: 'https://i.pravatar.cc/150?img=2',
      phone: '+57 301 234 5678',
      address: {
        street: 'Carrera 80 #50-30',
        city: 'Medellín',
        zipcode: '050002'
      },
      company: {
        name: 'Design Studio',
        position: 'Diseñadora UX/UI'
      },
      bio: 'Especialista en experiencia de usuario con pasión por el diseño centrado en el usuario.',
      website: 'https://mariagarcia.design',
      isActive: true,
      createdAt: new Date('2023-02-15T08:30:00Z'),
      updatedAt: new Date('2024-05-20T09:15:00Z')
    },
    {
      id: 3,
      username: 'carlos_rodriguez',
      email: 'carlos.rodriguez@example.com',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      phone: '+57 302 345 6789',
      address: {
        street: 'Avenida 70 #25-15',
        city: 'Medellín',
        zipcode: '050003'
      },
      company: {
        name: 'Data Corp',
        position: 'Analista de Datos'
      },
      bio: 'Analista de datos con experiencia en Big Data y Machine Learning.',
      website: 'https://carlos.ai',
      isActive: false,
      createdAt: new Date('2023-03-20T11:00:00Z'),
      updatedAt: new Date('2024-04-30T17:00:00Z')
    },
    {
      id: 4,
      username: 'ana_martinez',
      email: 'ana.martinez@example.com',
      firstName: 'Ana',
      lastName: 'Martínez',
      avatar: 'https://i.pravatar.cc/150?img=4',
      phone: '+57 303 456 7890',
      address: {
        street: 'Calle 60 #40-20',
        city: 'Medellín',
        zipcode: '050004'
      },
      company: {
        name: 'Marketing Plus',
        position: 'Gerente de Marketing'
      },
      bio: 'Especialista en marketing digital con enfoque en estrategias de crecimiento.',
      website: 'https://ana.marketing',
      isActive: true,
      createdAt: new Date('2023-04-05T14:00:00Z'),
      updatedAt: new Date('2024-06-05T10:45:00Z')
    }
  ];

  private validCredentials = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' },
    { username: 'test', password: 'test123' }
  ];

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return of(null).pipe(
      delay(Math.random() * 1000 + 1000),
      map(() => {
        const isValid = this.validCredentials.some(
          cred => cred.username === credentials.username && cred.password === credentials.password
        );

        if (isValid) {
          const user = this.mockUsers.find(u => u.username === credentials.username) || this.mockUsers[0];
          return {
            success: true,
            token: 'mock-jwt-token-' + Date.now(),
            user: user,
            message: 'Inicio de sesión exitoso'
          };
        } else {
          return {
            success: false,
            message: 'Credenciales inválidas. Intenta con: admin/admin123, user/user123, o test/test123'
          };
        }
      })
    );
  }

  getUsers(): Observable<User[]> {
    return of(null).pipe(
      delay(Math.random() * 1500 + 500),
      map(() => {
        if (Math.random() < 0.1) {
          throw new Error('Error del servidor: No se pudieron cargar los usuarios');
        }
        // Se devuelven todos los campos en esta versión
        return this.mockUsers;
      })
    );
  }

  getUserById(userId: number): Observable<User> {
    return of(null).pipe(
      delay(Math.random() * 1000 + 500),
      map(() => {
        if (Math.random() < 0.05) {
          throw new Error('Error del servidor: No se pudieron cargar los detalles del usuario');
        }

        const user = this.mockUsers.find(u => u.id === userId);
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
        return user;
      })
    );
  }
}
