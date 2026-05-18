import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly auth = inject(AuthService);
  readonly authService = this.auth;

  roleLabel = signal('');

  constructor() {
    this.updateRoleLabel();
  }

  private updateRoleLabel() {
    if (this.auth.isAdmin()) {
      this.roleLabel.set('Administrador');
    } else if (this.auth.isTutor() && this.auth.isStudent()) {
      this.roleLabel.set('Tutor / Estudiante');
    } else if (this.auth.isTutor()) {
      this.roleLabel.set('Tutor');
    } else if (this.auth.isStudent()) {
      this.roleLabel.set('Estudiante');
    }
  }

  @Output() toggle = new EventEmitter<void>();
}
