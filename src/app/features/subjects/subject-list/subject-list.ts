import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SubjectService } from '../../../core/services/subject.service';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-subject-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.css',
})
export class SubjectList implements OnInit {
  private readonly subjectService = inject(SubjectService);

  subjects: Subject[] = [];
  displayedColumns = ['id', 'name', 'actions'];

  ngOnInit() {
    this.subjectService.list().subscribe((data) => (this.subjects = data));
  }

  deleteSubject(id: number) {
    if (confirm('¿Eliminar esta materia?')) {
      this.subjectService.delete(id).subscribe(() => {
        this.subjects = this.subjects.filter((s) => s.id !== id);
      });
    }
  }
}
