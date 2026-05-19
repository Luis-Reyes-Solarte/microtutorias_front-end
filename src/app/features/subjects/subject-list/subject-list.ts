import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SubjectService } from '../../../core/services/subject.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from '../../../core/models/subject.model';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-subject-list',
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, AsyncPipe],
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.css',
})
export class SubjectList implements OnInit {
  private readonly subjectService = inject(SubjectService);
  readonly auth = inject(AuthService);
  @ViewChild(MatTable) table!: MatTable<Subject>;

  private refreshSubjects$ = new BehaviorSubject<void>(undefined);

  Subjects$: Observable<Subject[]> = this.refreshSubjects$.pipe(
    switchMap(() => this.subjectService.list()),
  );

  get displayedColumns(): string[] {
    return this.auth.isAdmin() ? ['id', 'name', 'actions'] : ['id', 'name'];
  }

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
