import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TutoringService } from '../../../core/services/tutoring.service';
import { TutoringAd } from '../../../core/models/tutoring.model';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-my-tutorings',
  imports: [RouterLink, DatePipe, AsyncPipe, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './my-tutorings.html',
  styleUrl: './my-tutorings.css',
})
export class MyTutorings {
  private readonly tutoringService = inject(TutoringService);
  @ViewChild(MatTable) table!: MatTable<TutoringAd>;

  private refresh$ = new BehaviorSubject<void>(undefined);
  tutorings$: Observable<TutoringAd[]> = this.refresh$.pipe(
    switchMap(() => this.tutoringService.list())
  );

  displayedColumns = ['id', 'subject', 'description', 'price', 'date', 'actions'];

  deleteTutoring(id: number) {
    if (confirm('Eliminar este anuncio?')) {
      this.tutoringService.delete(id).subscribe(() => this.refresh$.next());
    }
  }
}
