import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { BookingService } from '../../../core/services/booking.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking, BookingStatus } from '../../../core/models/booking.model';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

@Component({
  selector: 'app-my-bookings',
  imports: [
    RouterLink,
    DatePipe,
    AsyncPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings {
  private readonly bookingService = inject(BookingService);
  readonly reviewService = inject(ReviewService);
  readonly auth = inject(AuthService);

  private refresh$ = new BehaviorSubject<void>(undefined);
  bookings$: Observable<Booking[]> = this.refresh$.pipe(
    switchMap(() => this.bookingService.list())
  );

  displayedColumns = ['tutoring', 'tutor', 'status', 'created_at', 'actions'];

  statusLabel(status: BookingStatus): string {
    return STATUS_LABELS[status] || status;
  }

  statusColor(status: BookingStatus): string {
    switch (status) {
      case 'PENDING': return 'warn';
      case 'ACCEPTED': return 'primary';
      case 'COMPLETED': return '';
      case 'CANCELLED': return '';
      default: return '';
    }
  }

  canReview(booking: Booking): boolean {
    return booking.status === 'COMPLETED';
  }
}
