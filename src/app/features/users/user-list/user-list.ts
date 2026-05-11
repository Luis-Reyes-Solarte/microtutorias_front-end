import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  imports: [
    RouterLink,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private readonly userService = inject(UserService);

  users: User[] = [];
  displayedColumns = ['id', 'username', 'email', 'is_tutor', 'is_student', 'date_joined', 'actions'];

  ngOnInit() {
    this.userService.list().subscribe((data) => (this.users = data));
  }

  deleteUser(id: number) {
    if (confirm('¿Eliminar este usuario?')) {
      this.userService.delete(id).subscribe(() => {
        this.users = this.users.filter((u) => u.id !== id);
      });
    }
  }
}
