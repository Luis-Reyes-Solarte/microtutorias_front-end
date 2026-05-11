import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  is_tutor = false;
  is_student = true;
  hide = signal(true);
  error = '';

  register() {
    this.error = '';
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    this.userService
      .create({
        username: this.username,
        email: this.email,
        password: this.password,
        is_tutor: this.is_tutor,
        is_student: this.is_student,
      })
      .subscribe({
        next: () => {
          this.auth.login(this.username, this.password).subscribe({
            next: () => this.router.navigate(['/subjects']),
          });
        },
        error: (err) => {
          if (err.error?.username) {
            this.error = `Usuario: ${err.error.username.join(', ')}`;
          } else if (err.error?.email) {
            this.error = `Email: ${err.error.email.join(', ')}`;
          } else {
            this.error = 'Error al registrar. Intenta de nuevo.';
          }
        },
      });
  }
}
