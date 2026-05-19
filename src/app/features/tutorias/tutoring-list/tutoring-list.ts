import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { TutoringService } from '../../../core/services/tutoring.service';
import { SubjectService } from '../../../core/services/subject.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { TutoringAd } from '../../../core/models/tutoring.model';
import { Subject } from '../../../core/models/subject.model';
import { BehaviorSubject, Observable, switchMap, forkJoin, map } from 'rxjs';

interface TutoringListData {
  tutorings: TutoringAd[];
  subjects: Subject[];
}

@Component({
  selector: 'app-tutoring-list',
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
  ],
  templateUrl: './tutoring-list.html',
  styleUrl: './tutoring-list.css',
})
export class TutoringList {
  private readonly tutoringService = inject(TutoringService);
  private readonly subjectService = inject(SubjectService);
  private readonly bookingService = inject(BookingService);
  readonly auth = inject(AuthService);

  searchText = '';
  selectedSubject = '';
  bookingError = '';
  bookingSuccess = '';

  private refresh$ = new BehaviorSubject<void>(undefined);

  data$: Observable<TutoringListData> = this.refresh$.pipe(
    switchMap(() => forkJoin({
      tutorings: this.tutoringService.list(),
      subjects: this.subjectService.list(),
    })),
    map(({ tutorings, subjects }) => ({ tutorings, subjects }))
  );

  filteredTutorings(tutorings: TutoringAd[]): TutoringAd[] {
    return tutorings.filter((t) => {
      const matchText =
        !this.searchText ||
        t.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        t.subject_name?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchSubject = !this.selectedSubject || t.subject === Number(this.selectedSubject);
      return matchText && matchSubject;
    });
  }

  requestBooking(tutoringId: number) {
    this.bookingError = '';
    this.bookingSuccess = '';
    this.bookingService.create({ tutoring: tutoringId }).subscribe({
      next: () => {
        this.bookingSuccess = 'Solicitud enviada correctamente';
        setTimeout(() => (this.bookingSuccess = ''), 3000);
      },
      error: (err) => {
        this.bookingError =
          err.error?.message || err.error?.[0] || 'Error al solicitar la tutoría';
      },
    });
  }
}
