import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { BookingService } from '../../../core/services/booking.service';
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
  selector: 'app-tutor-bookings',
  imports: [DatePipe, AsyncPipe, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule],
  templateUrl: './tutor-bookings.html',
  styleUrl: './tutor-bookings.css',
})
export class TutorBookings {
  private readonly bookingService = inject(BookingService);

  private refresh$ = new BehaviorSubject<void>(undefined);
  bookings$: Observable<Booking[]> = this.refresh$.pipe(
    switchMap(() => this.bookingService.list())
  );

  displayedColumns = ['student', 'tutoring', 'status', 'created_at', 'actions'];

  statusLabel(status: BookingStatus): string {
    return STATUS_LABELS[status] || status;
  }

  canAccept(status: BookingStatus): boolean {
    return status === 'PENDING';
  }

  acceptBooking(id: number) {
    this.bookingService.accept(id).subscribe(() => this.refresh$.next());
  }

  rejectBooking(id: number) {
    if (confirm('Rechazar esta solicitud?')) {
      this.bookingService.reject(id).subscribe(() => this.refresh$.next());
    }
  }

  completeBooking(id: number) {
    this.bookingService.complete(id).subscribe(() => this.refresh$.next());
  }
}
