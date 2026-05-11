import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './shared/main-layout/main-layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { SubjectList } from './features/subjects/subject-list/subject-list';
import { SubjectForm } from './features/subjects/subject-form/subject-form';
import { UserList } from './features/users/user-list/user-list';
import { UserForm } from './features/users/user-form/user-form';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'subjects', component: SubjectList },
      { path: 'subjects/new', component: SubjectForm },
      { path: 'subjects/:id/edit', component: SubjectForm },
      { path: 'users', component: UserList },
      { path: 'users/new', component: UserForm },
      { path: 'users/:id/edit', component: UserForm },
      { path: '', redirectTo: 'subjects', pathMatch: 'full' },
    ],
  },
];
