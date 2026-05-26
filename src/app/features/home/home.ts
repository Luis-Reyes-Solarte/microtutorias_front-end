import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { SubjectService } from '../../core/services/subject.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  readonly auth = inject(AuthService);
  private readonly bookingService = inject(BookingService);
  private readonly subjectService = inject(SubjectService);

  bookings: Booking[] = [];
  subjectCount = 0;
  mobileNavOpen = false;

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.bookingService.list().subscribe({
        next: (data) => (this.bookings = data.slice(0, 4)),
      });
    }
    this.subjectService.list().subscribe({
      next: (data) => (this.subjectCount = data.length),
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'status-pending',
      ACCEPTED: 'status-accepted',
      COMPLETED: 'status-completed',
      CANCELLED: 'status-cancelled',
    };
    return map[status] || 'status-pending';
  }
}
