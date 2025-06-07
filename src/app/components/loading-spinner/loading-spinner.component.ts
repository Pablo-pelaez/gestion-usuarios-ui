import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Componente reutilizable para mostrar indicadores de carga
 * Permite personalizar el mensaje y el tamaño del spinner
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Cargando...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
