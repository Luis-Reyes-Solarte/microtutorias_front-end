import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/role.guard';
import { MainLayout } from './shared/main-layout/main-layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { Profile } from './features/profile/profile';
import { SubjectList } from './features/subjects/subject-list/subject-list';
import { SubjectForm } from './features/subjects/subject-form/subject-form';
import { UserList } from './features/users/user-list/user-list';
import { UserForm } from './features/users/user-form/user-form';
import { TutoringList } from './features/tutorias/tutoring-list/tutoring-list';
import { TutoringForm } from './features/tutorias/tutoring-form/tutoring-form';
import { MyTutorings } from './features/tutorias/my-tutorings/my-tutorings';
import { MyBookings } from './features/bookings/my-bookings/my-bookings';
import { TutorBookings } from './features/bookings/tutor-bookings/tutor-bookings';
import { ReviewForm } from './features/reviews/review-form/review-form';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'profile', component: Profile },
      { path: 'tutorias', component: TutoringList },
      { path: 'tutorias/new', component: TutoringForm },
      { path: 'tutorias/:id/edit', component: TutoringForm },
      { path: 'my-tutorias', component: MyTutorings },
      { path: 'my-bookings', component: MyBookings },
      { path: 'tutor-bookings', component: TutorBookings },
      { path: 'bookings/:id/review', component: ReviewForm },
      { path: 'subjects', component: SubjectList, canActivate: [adminGuard] },
      { path: 'subjects/new', component: SubjectForm, canActivate: [adminGuard] },
      { path: 'subjects/:id/edit', component: SubjectForm, canActivate: [adminGuard] },
      { path: 'users', component: UserList, canActivate: [adminGuard] },
      { path: 'users/new', component: UserForm, canActivate: [adminGuard] },
      { path: 'users/:id/edit', component: UserForm, canActivate: [adminGuard] },
    ],
  },
];
