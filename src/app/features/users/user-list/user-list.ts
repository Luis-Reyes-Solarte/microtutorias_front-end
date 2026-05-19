import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, AsyncPipe } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators'; // ¡No olvides este!

@Component({
  selector: 'app-user-list',
  imports: [
    RouterLink,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    AsyncPipe,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private readonly userService = inject(UserService);

  @ViewChild(MatTable) table!: MatTable<User>; // 3. Obtener referencia a la tabla

  // Usamos un Subject para disparar recargas de datos
  private refreshUsers$ = new BehaviorSubject<void>(undefined);

  // El observable que el HTML consumirá con el pipe | async
  users$: Observable<User[]> = this.refreshUsers$.pipe(switchMap(() => this.userService.list()));

  displayedColumns = [
    'username',
    'email',
    'is_tutor',
    'is_student',
    'date_joined',
    'actions',
  ];

  ngOnInit() {}

  deleteUser(id: number) {
    if (confirm('¿Eliminar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          // Opción A: Recargar de la API (más seguro)
          this.refreshUsers$.next();

          // Opción B: Si prefieres borrarlo localmente sin recargar:
          // Deberías cambiar la lógica de users$ para que soporte filtrado local.
        },
        error: (err) => console.error('Error al borrar', err),
      });
    }
  }
}
