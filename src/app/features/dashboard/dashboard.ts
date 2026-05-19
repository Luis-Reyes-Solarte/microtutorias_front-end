import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { SubjectService } from '../../core/services/subject.service';
import { TutoringService } from '../../core/services/tutoring.service';
import { BookingService } from '../../core/services/booking.service';
import { BehaviorSubject, Observable, switchMap, forkJoin, map } from 'rxjs';

interface DashboardData {
  totalUsers: number;
  totalSubjects: number;
  totalTutorings: number;
  totalBookings: number;
  myBookings: any[];
  myTutorings: any[];
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly subjectService = inject(SubjectService);
  private readonly tutoringService = inject(TutoringService);
  private readonly bookingService = inject(BookingService);

  private refresh$ = new BehaviorSubject<void>(undefined);

  data$: Observable<DashboardData> = this.refresh$.pipe(
    switchMap(() => {
      if (this.auth.isAdmin()) {
        return forkJoin({
          users: this.userService.list(),
          subjects: this.subjectService.list(),
          tutorings: this.tutoringService.list(),
          bookings: this.bookingService.list(),
        }).pipe(
          map(({ users, subjects, tutorings, bookings }) => ({
            totalUsers: users.length,
            totalSubjects: subjects.length,
            totalTutorings: tutorings.length,
            totalBookings: bookings.length,
            myBookings: [],
            myTutorings: [],
          }))
        );
      }
      if (this.auth.isTutor()) {
        return forkJoin({
          tutorings: this.tutoringService.list(),
          bookings: this.bookingService.list(),
        }).pipe(
          map(({ tutorings, bookings }) => ({
            totalUsers: 0,
            totalSubjects: 0,
            totalTutorings: tutorings.length,
            totalBookings: 0,
            myBookings: bookings,
            myTutorings: tutorings,
          }))
        );
      }
      return this.bookingService.list().pipe(
        map((bookings) => ({
          totalUsers: 0,
          totalSubjects: 0,
          totalTutorings: 0,
          totalBookings: 0,
          myBookings: bookings,
          myTutorings: [],
        }))
      );
    })
  );
}
