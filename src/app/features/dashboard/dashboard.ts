import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { SubjectService } from '../../core/services/subject.service';
import { TutoringService } from '../../core/services/tutoring.service';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly subjectService = inject(SubjectService);
  private readonly tutoringService = inject(TutoringService);
  private readonly bookingService = inject(BookingService);

  totalUsers = 0;
  totalSubjects = 0;
  totalTutorings = 0;
  totalBookings = 0;
  myBookings: any[] = [];
  myTutorings: any[] = [];

  ngOnInit() {
    if (this.auth.isAdmin()) {
      this.userService.list().subscribe((d) => (this.totalUsers = d.length));
      this.subjectService.list().subscribe((d) => (this.totalSubjects = d.length));
      this.tutoringService.list().subscribe((d) => (this.totalTutorings = d.length));
      this.bookingService.list().subscribe((d) => (this.totalBookings = d.length));
    }
    if (this.auth.isTutor()) {
      this.tutoringService.list().subscribe((d) => {
        this.myTutorings = d;
        this.totalTutorings = d.length;
      });
      this.bookingService.list().subscribe((d) => (this.myBookings = d));
    }
    if (this.auth.isStudent() && !this.auth.isTutor()) {
      this.bookingService.list().subscribe((d) => (this.myBookings = d));
    }
  }
}
