import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
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

@Component({
  selector: 'app-tutoring-list',
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
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
export class TutoringList implements OnInit {
  private readonly tutoringService = inject(TutoringService);
  private readonly subjectService = inject(SubjectService);
  private readonly bookingService = inject(BookingService);
  readonly auth = inject(AuthService);

  tutorings: TutoringAd[] = [];
  subjects: Subject[] = [];
  searchText = '';
  selectedSubject = '';
  loading = false;
  bookingError = '';
  bookingSuccess = '';

  ngOnInit() {
    this.loading = true;
    this.tutoringService.list().subscribe((data) => {
      this.tutorings = data;
      this.loading = false;
    });
    this.subjectService.list().subscribe((data) => (this.subjects = data));
  }

  get filteredTutorings(): TutoringAd[] {
    return this.tutorings.filter((t) => {
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
