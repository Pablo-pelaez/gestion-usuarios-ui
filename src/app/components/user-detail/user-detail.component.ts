import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  user: User | null = null;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserDetails(+userId);
    } else {
      this.error = 'ID de usuario no válido';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserDetails(id: number): void {
    this.loading = true;
    this.error = '';

    this.userService.getUserById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar los detalles del usuario';
          this.loading = false;
          console.error('Error loading user details:', error);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  onErrorDismiss(): void {
    this.error = '';
  }
}
