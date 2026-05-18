import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SubjectService } from '../../../core/services/subject.service';
import { Subject } from '../../../core/models/subject.model';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators'; // ¡No olvides este!
import { DatePipe, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-subject-list',
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, AsyncPipe],
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.css',
})
export class SubjectList implements OnInit {
  private readonly subjectService = inject(SubjectService);
  @ViewChild(MatTable) table!: MatTable<Subject>; // 3. Obtener referencia a la tabla

  // Usamos un Subject para disparar recargas de datos
  private refreshSubjects$ = new BehaviorSubject<void>(undefined);

  // El observable que el HTML consumirá con el pipe | async
  Subjects$: Observable<Subject[]> = this.refreshSubjects$.pipe(
    switchMap(() => this.subjectService.list()),
  );

  displayedColumns = ['id', 'name', 'actions'];

  ngOnInit() {}

  deleteSubject(id: number) {
    if (confirm('¿Eliminar esta materia?')) {
      this.subjectService.delete(id).subscribe({
        next: () => {
          // Opción A: Recargar de la API (más seguro)
          this.refreshSubjects$.next();

          // Opción B: Si prefieres borrarlo localmente sin recargar:
          // Deberías cambiar la lógica de users$ para que soporte filtrado local.
        },
        error: (err) => console.error('Error al borrar', err),
      });
    }
  }
}
