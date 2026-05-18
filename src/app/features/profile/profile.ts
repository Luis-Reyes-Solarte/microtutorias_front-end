import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    DatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSlideToggleModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);
  readonly authService = this.auth;

  model: Partial<User> = {};
  editing = false;
  success = '';
  error = '';

  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passSuccess = '';
  passError = '';

  ngOnInit() {
    this.userService.me().subscribe({
      next: (data) => (this.model = data),
      error: () => (this.error = 'Error al cargar perfil'),
    });
  }

  toggleEdit() {
    this.editing = !this.editing;
    this.success = '';
    this.error = '';
  }

  save() {
    this.error = '';
    this.success = '';
    const payload: any = {};
    if (this.model.username) payload['username'] = this.model.username;
    if (this.model.email) payload['email'] = this.model.email;
    payload['is_tutor'] = this.model.is_tutor;
    payload['is_student'] = this.model.is_student;

    this.userService.updateMe(payload).subscribe({
      next: (data) => {
        this.model = data;
        this.editing = false;
        this.success = 'Perfil actualizado correctamente';
        this.authService.updateRolesFromUser(data);
      },
      error: (err) => {
        if (err.error) {
          const msgs = Object.values(err.error).flat().join(', ');
          this.error = msgs || 'Error al actualizar';
        } else {
          this.error = 'Error al actualizar';
        }
      },
    });
  }

  changePassword() {
    this.passError = '';
    this.passSuccess = '';

    if (!this.oldPassword || !this.newPassword || !this.confirmNewPassword) {
      this.passError = 'Completa todos los campos de contraseña';
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.passError = 'Las contraseñas nuevas no coinciden';
      return;
    }
    if (this.newPassword.length < 8) {
      this.passError = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.userService
      .changePassword({
        old_password: this.oldPassword,
        new_password: this.newPassword,
        confirm_new_password: this.confirmNewPassword,
      })
      .subscribe({
        next: () => {
          this.passSuccess = 'Contraseña actualizada correctamente';
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
        },
        error: (err) => {
          if (err.error) {
            const msgs = Object.values(err.error).flat().join(', ');
            this.passError = msgs || 'Error al cambiar contraseña';
          } else {
            this.passError = 'Error al cambiar contraseña';
          }
        },
      });
  }

  get roleLabel(): string {
    const roles: string[] = [];
    if (this.auth.isAdmin()) roles.push('Administrador');
    if (this.auth.isTutor()) roles.push('Tutor');
    if (this.auth.isStudent()) roles.push('Estudiante');
    return roles.join(', ') || 'Usuario';
  }
}
