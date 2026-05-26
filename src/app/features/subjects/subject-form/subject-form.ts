import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SubjectService } from '../../../core/services/subject.service';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-subject-form',
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './subject-form.html',
  styleUrl: './subject-form.css',
})
export class SubjectForm implements OnInit {
  private readonly subjectService = inject(SubjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEdit = false;
  model: Partial<Subject> = { name: '' };

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.subjectService.get(id).subscribe((data) => (this.model = data));
    }
  }

  save() {
    const obs = this.isEdit
      ? this.subjectService.update(this.model.id!, this.model)
      : this.subjectService.create(this.model);

    obs.subscribe(() => this.router.navigate(['/app/subjects']));
  }
}
