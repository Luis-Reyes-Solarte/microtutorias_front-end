import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ReviewService } from '../../../core/services/review.service';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';
import { BehaviorSubject, Observable, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-review-form',
  imports: [
    FormsModule,
    RouterLink,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './review-form.html',
  styleUrl: './review-form.css',
})
export class ReviewForm {
  private readonly reviewService = inject(ReviewService);
  private readonly bookingService = inject(BookingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  bookingId = Number(this.route.snapshot.params['id']);
  private fetchBooking$ = new BehaviorSubject<void>(undefined);

  booking$: Observable<Booking | null> = this.fetchBooking$.pipe(
    switchMap(() => this.bookingService.get(this.bookingId)),
    catchError(() => {
      this.router.navigate(['/app/my-bookings']);
      return of(null);
    })
  );

  rating = 0;
  comment = '';
  hoverRating = 0;
  loading = false;
  error = '';
  success = '';

  setRating(value: number) {
    this.rating = value;
  }

  submitReview(booking: Booking) {
    if (this.rating === 0) {
      this.error = 'Selecciona una calificación';
      return;
    }
    this.loading = true;
    this.error = '';
    this.reviewService.create({
      booking: this.bookingId,
      tutoring: booking.tutoring,
      rating: this.rating,
      comment: this.comment,
    }).subscribe({
      next: () => {
        this.success = 'Reseña enviada correctamente';
        setTimeout(() => this.router.navigate(['/app/my-bookings']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al enviar la reseña';
        this.loading = false;
      },
    });
  }
}
